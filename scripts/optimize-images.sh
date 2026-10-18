#!/usr/bin/env bash
#
# optimize-images — otimiza as imagens de images/ para WebP
#
# Converte jpg/jpeg/png/avif/... em .webp (largura máxima 1200px, qualidade 80,
# sem metadados), substitui os originais, atualiza automaticamente as
# referências em data.js e index.html e valida tudo no final.
#
# Uso:
#   optimize-images                   # converte pendentes + atualiza referências
#   optimize-images --check           # só valida (referências, colisões, pendentes)
#   optimize-images --all             # também recomprime os .webp existentes
#   optimize-images --keep-originals  # move originais p/ images/originals/ (em vez de apagar)
#
# Via flake:
#   nix develop          # depois: optimize-images
#   nix run .#optimize   # one-shot (acrescenta -- --check para só validar)

set -o errexit -o nounset -o pipefail

CHECK_ONLY=0
RECOMPRESS_WEBP=0
KEEP_ORIGINALS=0
MAX_WIDTH=1200
QUALITY=80
QUALITY_FALLBACK=65

if [ -t 1 ]; then
  C_RED=$'\033[31m'
  C_YELLOW=$'\033[33m'
  C_GREEN=$'\033[32m'
  C_BOLD=$'\033[1m'
  C_DIM=$'\033[2m'
  C_RESET=$'\033[0m'
else
  C_RED=''
  C_YELLOW=''
  C_GREEN=''
  C_BOLD=''
  C_DIM=''
  C_RESET=''
fi

N_ERRORS=0
N_WARNINGS=0
N_REFS_UPDATED=0

usage() {
  cat <<'EOF'
Uso: optimize-images [opções]

  (sem opções)           converte imagens pendentes p/ WebP e atualiza data.js/index.html
  --check                só valida: referências partidas, colisões, formatos por converter
  --all                  inclui também a recompressão dos .webp já existentes
  --keep-originals       move os originais para images/originals/ em vez de os apagar
  -h, --help             mostra esta ajuda
EOF
}

log() { printf '%b\n' "$*"; }
info() { printf '%b\n' "${C_DIM}·${C_RESET} $*"; }
ok() { printf '%b\n' "${C_GREEN}✓${C_RESET} $*"; }
warn() { printf '%b\n' "${C_YELLOW}aviso:${C_RESET} $*" >&2; N_WARNINGS=$((N_WARNINGS + 1)); }
err() { printf '%b\n' "${C_RED}erro:${C_RESET} $*" >&2; N_ERRORS=$((N_ERRORS + 1)); }
fatal() {
  printf '%b\n' "${C_RED}erro:${C_RESET} $*" >&2
  exit 1
}

# tamanho em bytes (portável: GNU/BSD wc)
file_size() {
  local n
  n="$(wc -c <"$1")"
  printf '%d\n' "$((n))"
}

# bytes → formato legível (numfmt do coreutils, com fallback)
human() {
  if command -v numfmt >/dev/null 2>&1; then
    numfmt --to=iec --round=nearest "$1"
  else
    printf '%s B' "$1"
  fi
}

# tamanho total de uma pasta em bytes (du -sk é portável GNU/BSD)
dir_size() {
  local kb
  kb="$(du -sk "$1" 2>/dev/null | cut -f1)"
  printf '%d\n' "$((kb * 1024))"
}

find_root() {
  local root=''
  if command -v git >/dev/null 2>&1; then
    root="$(git rev-parse --show-toplevel 2>/dev/null)" || root=''
  fi
  printf '%s\n' "${root:-$(pwd)}"
}

# substituição literal (sem regex) de old por new no ficheiro todo
replace_in_file() {
  local file="$1" old="$2" new="$3" n content
  n="$(grep -oF "$old" "$file" 2>/dev/null | wc -l || true)"
  n="$((n))"
  [ "$n" -gt 0 ] || return 0
  content="$(cat "$file"; printf X)"
  content="${content%X}"
  printf '%s' "${content//"$old"/"$new"}" >"$file"
  ok "$(basename "$file"): $old → $new (${n}x)"
  N_REFS_UPDATED=$((N_REFS_UPDATED + n))
}

check_file_reference() {
  local origin="$1" ref="$2" file rel
  case "$ref" in
    http://* | https://*)
      rel="images/${ref##*/images/}"
      ;;
    *)
      rel="${ref#./}"
      ;;
  esac
  file="$ROOT/$rel"
  if [ ! -f "$file" ]; then
    err "$origin: imagem referenciada não existe: $ref"
    return 0
  fi
  if ! magick identify "$file" >/dev/null 2>&1; then
    err "$origin: não é uma imagem válida: $ref"
    return 0
  fi
  case "$ref" in
    *.webp | *.WEBP) ;;
    *)
      warn "$origin: não está em WebP (pode ser otimizado): $ref"
      ;;
  esac
}

check_references() {
  local ref url errs_before warns_before n_ref_errs n_ref_warns
  errs_before="$N_ERRORS"
  warns_before="$N_WARNINGS"
  info "A validar referências de imagens em data.js e index.html..."

  if [ -f "$ROOT/data.js" ]; then
    while IFS= read -r ref; do
      [ -n "$ref" ] || continue
      check_file_reference "data.js" "$ref"
    done < <(
      grep -oE 'image:[[:space:]]*"[^"]*"' "$ROOT/data.js" 2>/dev/null |
        sed -E 's/^.*"(.*)"$/\1/' || true
    )
  fi

  if [ -f "$ROOT/index.html" ]; then
    while IFS= read -r url; do
      [ -n "$url" ] || continue
      check_file_reference "index.html" "$url"
    done < <(grep -oE 'https://[^"]+/images/[^"]+' "$ROOT/index.html" 2>/dev/null | sort -u || true)
  fi

  n_ref_errs=$((N_ERRORS - errs_before))
  n_ref_warns=$((N_WARNINGS - warns_before))
  if [ "$n_ref_errs" -eq 0 ]; then
    ok "Todas as referências de imagem existem e são válidas"
  else
    printf '%b\n' "${C_RED}${n_ref_errs} referência(s) inválida(s)${C_RESET}" >&2
  fi
  if [ "$n_ref_warns" -gt 0 ]; then
    warn "${n_ref_warns} aviso(s) — ver lista acima"
  fi
  return 0
}

# --- argumentos -------------------------------------------------------------

while [ $# -gt 0 ]; do
  case "$1" in
    --check) CHECK_ONLY=1 ;;
    --all) RECOMPRESS_WEBP=1 ;;
    --keep-originals) KEEP_ORIGINALS=1 ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      printf 'erro: opção desconhecida: %s\n\n' "$1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

# --- ambiente ---------------------------------------------------------------

ROOT="$(find_root)"
IMAGEDIR="$ROOT/images"
DATA="$ROOT/data.js"
INDEX="$ROOT/index.html"

[ -d "$IMAGEDIR" ] || fatal "pasta images/ não encontrada em $ROOT"
command -v magick >/dev/null 2>&1 ||
  fatal "magick não encontrado — corre 'nix develop' ou 'nix run .#optimize'"

# --- seleção de ficheiros ---------------------------------------------------

filters=(
  -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.avif' -o
  -iname '*.heic' -o -iname '*.tiff' -o -iname '*.tif' -o -iname '*.gif' -o
  -iname '*.bmp'
)
if [ "$RECOMPRESS_WEBP" = 1 ]; then
  filters+=(-o -iname '*.webp')
fi

sources=()
while IFS= read -r f; do
  sources+=("$f")
done < <(find "$IMAGEDIR" -maxdepth 1 -type f \( "${filters[@]}" \) | LC_ALL=C sort)

# --- colisões ---------------------------------------------------------------

declare -A n_by_name=()
for src in "${sources[@]}"; do
  base="$(basename "$src")"
  name="${base%.*}"
  n_by_name["$name"]=$((${n_by_name["$name"]:-0} + 1))
done

if [ "$CHECK_ONLY" = 1 ]; then
  log "${C_BOLD}optimize-images --check${C_RESET} ${C_DIM}($ROOT)${C_RESET}"
else
  if [ "${#sources[@]}" -eq 0 ]; then
    ok "Nada para otimizar — todas as imagens já estão em WebP"
    check_references
    [ "$N_ERRORS" -eq 0 ] || exit 1
    exit 0
  fi
  log "${C_BOLD}A otimizar ${#sources[@]} imagem(ns)${C_RESET} ${C_DIM}(WebP, máx. ${MAX_WIDTH}px, q${QUALITY}, sem metadados)${C_RESET}\n"
fi

for src in "${sources[@]}"; do
  base="$(basename "$src")"
  name="${base%.*}"
  target="$IMAGEDIR/$name.webp"
  if [ "${n_by_name["$name"]}" -gt 1 ]; then
    err "colisão: '${base}' e outro ficheiro converteriam ambos para $name.webp — renomeia um deles"
    continue
  fi
  if [ "$src" != "$target" ] && [ -e "$target" ]; then
    err "colisão: '$base' quer converter para '$name.webp', que já existe — remove um dos dois"
  fi
done

if [ "$CHECK_ONLY" = 1 ]; then
  if [ "${#sources[@]}" -gt 0 ]; then
    info "${#sources[@]} imagem(ns) por otimizar:"
    for src in "${sources[@]}"; do
      printf '    %s\n' "images/$(basename "$src")"
    done
  else
    ok "Nenhuma imagem por otimizar (tudo em WebP)"
  fi
  check_references
  [ "$N_ERRORS" -eq 0 ] || exit 1
  exit 0
fi

if [ "$N_ERRORS" -gt 0 ]; then
  printf '%b\n' "${C_RED}${N_ERRORS} colisão(ões) em aberto — nada foi convertido; corrige e volta a correr${C_RESET}" >&2
  exit 1
fi

# --- conversão ---------------------------------------------------------------

convert_one() {
  # $1 = qualidade, $2 = origem, $3 = saída
  magick "$2" -auto-orient -resize "${MAX_WIDTH}x>" -quality "$1" \
    -strip -define webp:method=6 "$3"
}

TMP="$(mktemp -d "${TMPDIR:-/tmp}/optimize-images.XXXXXX")"
trap 'rm -rf "$TMP"' EXIT

DIR_BEFORE="$(dir_size "$IMAGEDIR")"
DIR_BEFORE_H="$(human "$DIR_BEFORE")"

row_file=()
row_before=()
row_after=()
row_status=()
N_CONVERTED=0
N_KEPT=0
SUM_BEFORE=0
SUM_AFTER=0

for src in "${sources[@]}"; do
  base="$(basename "$src")"
  name="${base%.*}"
  target="$IMAGEDIR/$name.webp"
  out="$TMP/$name.webp"
  before="$(file_size "$src")"
  status="ok"

  convert_one "$QUALITY" "$src" "$out"
  after="$(file_size "$out")"

  if [ "$after" -gt "$before" ]; then
    convert_one "$QUALITY_FALLBACK" "$src" "$out"
    after="$(file_size "$out")"
    if [ "$after" -gt "$before" ]; then
      status="mantido (webp maior)"
    else
      status="ok (q$QUALITY_FALLBACK)"
    fi
  fi

  if [ "$status" != "mantido (webp maior)" ] &&
    ! magick identify "$out" >/dev/null 2>&1; then
    status="ERRO (verificação falhou)"
    after="$before"
  fi

  row_file+=("$base")
  row_before+=("$before")
  row_after+=("$after")
  row_status+=("$status")

  case "$status" in
    ERRO*)
      err "conversão de '$base' falhou a validação — original mantido"
      N_KEPT=$((N_KEPT + 1))
      continue
      ;;
    mantido*)
      warn "'$base': WebP ficou maior que o original — original mantido"
      N_KEPT=$((N_KEPT + 1))
      continue
      ;;
  esac

  mv "$out" "$target"
  N_CONVERTED=$((N_CONVERTED + 1))
  SUM_BEFORE=$((SUM_BEFORE + before))
  SUM_AFTER=$((SUM_AFTER + after))

  old_ref="images/$base"
  new_ref="images/$name.webp"
  if [ "$old_ref" != "$new_ref" ]; then
    refs_before=$N_REFS_UPDATED
    if [ -f "$DATA" ]; then
      replace_in_file "$DATA" "$old_ref" "$new_ref"
    fi
    if [ -f "$INDEX" ]; then
      replace_in_file "$INDEX" "$old_ref" "$new_ref"
    fi
    if [ "$N_REFS_UPDATED" -eq "$refs_before" ]; then
      warn "nenhuma referência encontrada para $old_ref — se a usar noutro sítio, atualiza manualmente"
    fi
  fi

  if [ "$src" != "$target" ]; then
    if [ "$KEEP_ORIGINALS" = 1 ]; then
      mkdir -p "$IMAGEDIR/originals"
      mv "$src" "$IMAGEDIR/originals/"
    else
      rm -f "$src"
    fi
  fi
done

# --- validação final --------------------------------------------------------

check_references

# --- resumo -----------------------------------------------------------------

DIR_AFTER="$(dir_size "$IMAGEDIR")"
DIR_AFTER_H="$(human "$DIR_AFTER")"

printf '\n%bResumo%b\n' "$C_BOLD" "$C_RESET"
printf '%-32s %9s %9s %8s  %s\n' 'ficheiro' 'antes' 'depois' 'delta' 'estado'
printf '%-32s %9s %9s %8s  %s\n' '--------' '-----' '------' '-----' '------'
i=0
while [ "$i" -lt "${#row_file[@]}" ]; do
  b="${row_before[$i]}"
  a="${row_after[$i]}"
  if [ "$b" -gt 0 ]; then
    pct="$(( (a - b) * 100 / b ))%"
  else
    pct='—'
  fi
  printf '%-32s %9s %9s %8s  %s\n' "${row_file[$i]}" "$(human "$b")" "$(human "$a")" "$pct" "${row_status[$i]}"
  i=$((i + 1))
done

if [ "$N_CONVERTED" -gt 0 ]; then
  delta=$((SUM_AFTER - SUM_BEFORE))
  printf '\n%bConvertidas:%b %d | mantidas: %d | referências atualizadas: %d\n' \
    "$C_BOLD" "$C_RESET" "$N_CONVERTED" "$N_KEPT" "$N_REFS_UPDATED"
  printf '%bPoupança nesta execução:%b %s → %s (%s, %d%%)\n' \
    "$C_GREEN" "$C_RESET" "$(human "$SUM_BEFORE")" "$(human "$SUM_AFTER")" \
    "$(human "$((0 - delta))")" "$((delta * 100 / SUM_BEFORE))"
fi
printf '%bimages/:%b %s → %s\n' "$C_BOLD" "$C_RESET" "$DIR_BEFORE_H" "$DIR_AFTER_H"

[ "$N_ERRORS" -eq 0 ] || exit 1
exit 0

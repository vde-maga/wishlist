{
  description = "Wishlist — otimização de imagens (WebP)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      packages = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          optimize-images = pkgs.writeShellApplication {
            name = "optimize-images";
            runtimeInputs = with pkgs; [
              imagemagick
              coreutils
              gnugrep
              gnused
              findutils
            ];
            text = builtins.readFile ./scripts/optimize-images.sh;
          };
          default = self.packages.${system}.optimize-images;
        });

      apps = forAllSystems (system: {
        default = {
          type = "app";
          program = "${self.packages.${system}.default}/bin/optimize-images";
        };
        optimize = {
          type = "app";
          program = "${self.packages.${system}.optimize-images}/bin/optimize-images";
        };
      });

      devShells = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.imagemagick
              self.packages.${system}.optimize-images
            ];
          };
        });

      # nix flake check constrói isto — o writeShellApplication corre
      # shellcheck no build, portanto script inválido = build falha
      checks = forAllSystems (system: {
        optimize-images = self.packages.${system}.optimize-images;
      });
    };
}

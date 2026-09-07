// Reservation system - manages item reservations

import { storage } from "./storage.js";

export const isReserved = (id) => {
  return storage.getReservedItems().includes(id);
};

export const toggleReservation = (id) => {
  const reserved = storage.getReservedItems();
  const index = reserved.indexOf(id);

  if (index > -1) {
    reserved.splice(index, 1);
  } else {
    reserved.push(id);
  }

  storage.setReservedItems(reserved);
};

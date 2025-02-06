import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor() { }

  //titulo:string = "Titulo";   "asi era antes pero es mejor usar signal"
titulo = signal("Titulo");
extendido = signal(false);
}

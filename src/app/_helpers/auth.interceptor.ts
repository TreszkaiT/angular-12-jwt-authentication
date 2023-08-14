import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../_services/token-storage.service';
import { Observable } from 'rxjs';

// const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end
const TOKEN_HEADER_KEY = 'x-access-token';   // for Node.js Express back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {                                         // HttpInterceptor: rá Hook-olhatok a kimenő kérésre. Elkapom velük a Request-eket és Response-okat, és adatokat tehetek bele v. olvashatok ki a segítségével
  constructor(private tokenService: TokenStorageService) { }                                             // AuthInterceptor-nak implementálni kell a HttpInterceptor-t

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.tokenService.getToken();                                                          // a tokenService felolvassa az adott Tokent a Storage-ból
    if (token != null) {
      // for Spring Boot back-end
      // authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

      // for Node.js Express back-end
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, token) });                 // a HttpRequest clone metódusával készítünk egy másolatot az eredeti Request-ből, és beállítom neki a headers-t és a token-t
    }
    return next.handle(authReq);                                                                // továbbküldöm a Requestet
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }        // a HTTP_INTERCEPTORS mögé beteszünk egy AuthInterceptor-t
];
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip adding token for login/signup requests
  if (!req.url.endsWith('/login') && !req.url.endsWith('/signup')) {
    const authToken = localStorage.getItem('token');
    if (authToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
      return next(authReq);
    }
  }

  // Otherwise, pass the original request on
  return next(req);
};

/* import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the token from localStorage
  const authToken = localStorage.getItem('token');

  // Clone the request and add the authorization header if a token exists
  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
  }

  // Otherwise, pass the original request on
  return next(req);
}; */
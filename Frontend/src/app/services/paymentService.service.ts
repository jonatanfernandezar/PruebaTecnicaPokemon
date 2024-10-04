import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentData } from '.././models/auth-user.model';

@Injectable({
    providedIn: 'root',
})

export class PaymentService {

    private apiUrl = 'http://localhost:8000/api/v1/payment/create-order';
    private apiUrlPurchase = 'http://localhost:8000/api/v1/payment/webhook';

    constructor(private http: HttpClient) { }

    createOrder(items: any[]): Observable<any> {
        console.log('Enviando ítems al backend: ', items);
        return this.http.post<any>(this.apiUrl, { items });
    }

    getPurchases(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrlPurchase);
    }
}

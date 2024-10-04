import { Component } from '@angular/core';
import { PaymentService } from '../../../services/paymentService.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-compras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-compras.component.html',
  styleUrl: './gestion-compras.component.css'
})
export class GestionComprasComponent {
  purchases: any[] = [];
  errorMessage: string | null = null;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.getPurchasesPokemon();
  }

  getPurchasesPokemon(): void {
    this.paymentService.getPurchases().subscribe(
      (data) => {
        this.purchases = data;
        console.log('Las compras son', this.purchases);
      },
      (error) => {
        this.errorMessage = 'Error al obtener las compras';
        console.error(error);
      }
    );
  }
}

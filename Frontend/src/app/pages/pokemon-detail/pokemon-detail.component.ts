import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PokemonService } from '../../services/api-pokemon.service';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/paymentService.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})

export class PokemonDetailComponent implements OnInit {
  pokemon: any;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
    private paymentService: PaymentService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getPokemonDetails(id);
    }
  }

  getPokemonDetails(id: string): void {
    this.pokemonService.getPokemonDetails(id).subscribe({
      next: (response) => {
        this.pokemon = response;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener los detalles del Pokémon';
        console.error('Error:', error);
      },
    });
  }

  onPay(): void {
    console.log('Estos son los datos de Pokemon: ', this.pokemon);
    const itemToSend = {
      name: this.pokemon.name,
      price: this.pokemon.base_experience,
      quantity: 1,
    };
    this.paymentService.createOrder([itemToSend]).subscribe(
      (response) => {
        console.log('La respuesta es: ', response);
        window.location.href = response.redirect_url;
        if (response.redirect_url) {
          window.location.href = response.redirect_url;
        }
      });
  }
}
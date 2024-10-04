import { Component } from '@angular/core';
import { PokemonService } from '../../services/api-pokemon.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-user.component.html',
  styleUrl: './dashboard-user.component.css'
})
export class DashboardUserComponent {
  pokemonList: any[] = [];
  errorMessage: string = '';

  constructor(private pokemonService: PokemonService, private router: Router) {}

  ngOnInit(): void {
    this.fetchPokemonList();
  }

  fetchPokemonList(): void {
    this.pokemonService.getPokemonList(20).subscribe({
      next: (response) => {
        this.pokemonList = response;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener los datos de Pokémon';
        console.error('Error:', error);
      },
    });
  }

   viewPokemonDetails(id: number): void {
    this.router.navigate(['/dashboard-user/pokemon', id]);
  }
}

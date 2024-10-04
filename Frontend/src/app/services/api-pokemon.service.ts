import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemonList(limit: number = 10, offset: number = 0): Observable<any[]> {
    return this.http
      .get<any>(`${this.apiUrl}?limit=${limit}&offset=${offset}`)
      .pipe(
        map((response) => response.results || []),
        switchMap((results: any[]) => {
          const requests = results.map((pokemon: any) =>
            this.getPokemonDetails(pokemon.name)
          );
          return forkJoin(requests);
        })
      );
  }

  getPokemonDetails(nameOrId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${nameOrId}`);
  }
}

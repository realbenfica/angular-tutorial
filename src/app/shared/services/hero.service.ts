import { Injectable } from '@angular/core';
import { Hero } from '../../Hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';

@Injectable({
    providedIn: 'root'
})
export class HeroService {
    constructor(
        private messageService: MessageService,
        private http: HttpClient
    ) {}

    private log(message: string) {
        this.messageService.add(`HeroService: ${message}`);
    }

    private heroesUrl = 'api/heroes';

    getHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>(this.heroesUrl).pipe(
            tap(_ => this.log('fetched heroes')),
            catchError(this.handleError<Hero[]>('getHeroes', []))
        );
    }

    getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url).pipe(
            tap(_ => this.log(`fetched hero id number ${id}`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
    }

    updateHero(hero: Hero): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        const url = `${this.heroesUrl}/${hero.id}`;
        return this.http.put<Hero>(url, hero, httpOptions).pipe(
            tap(_ => this.log('fetched heroes')),
            catchError(this.handleError<Hero>(`getHero id=${hero.id}`))
        );
    }

    addHero(hero: Hero): Observable<Hero> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
            tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
            catchError(this.handleError<Hero>(`addHero`))
        );
    }

    deleteHero(hero: Hero): Observable<Hero> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        const url = `${this.heroesUrl}/${hero.id}`;
        return this.http.delete<Hero>(url, httpOptions).pipe(
            tap(() => this.log(`deleted hero ${hero.name}`)),
            catchError(this.handleError<Hero>(`deleteHero`))
        );
    }

    searchHeroes(term: string): Observable<Hero[]> {
        if (!term.trim()) {
            return of([]);
        }
        return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
            tap(_ => this.log(`found heroes matching "${term}"`)),
            catchError(this.handleError<Hero[]>('searchHeroes', []))
        );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}

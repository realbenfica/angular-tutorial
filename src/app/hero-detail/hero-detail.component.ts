import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../Hero';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../shared/services/hero.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-hero-detail',
    templateUrl: './hero-detail.component.html',
    styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
    hero: Hero;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private heroService: HeroService
        ) {}

    ngOnInit() {
        this.getHero()
    }

    getHero(): void {
        const id = +this.route.snapshot.params.id
        this.heroService.getHero(id).subscribe(hero => this.hero = hero)
    }

    goBack(): void {
        this.location.back()
    }

    save(): void {
        this.heroService.updateHero(this.hero).subscribe(()=> this.goBack())
    }
}

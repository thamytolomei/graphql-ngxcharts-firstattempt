import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { PokemonGraphqlService } from './services/pokemon.service';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface HeatmapSeries {
  name: string;
  value: number;
}
interface HeatmapData {
  name: string;
  series: HeatmapSeries[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxChartsModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  title = 'ChartsQL';

  view: [number, number] = [undefined as any, 400];
  data: any;

  heatmapData: HeatmapData[] = [];
  originalHeatmapData: HeatmapData[] = [];
  filteredHeatmapData: HeatmapData[] = [];
  pieChartData: { name: string; value: number }[] = [];

  selectedPokemons: string[] = [];
  selectedPokemon = '';
  selectedDateRange: [string, string] = ['17/04/2025', '30/04/2025'];
  startDate = '2025-04-17';
  endDate = '2025-04-30';
  minDamage = 0;

  readonly DATES = [
    '17/04/2025', '22/04/2025', '23/04/2025',
    '24/04/2025', '25/04/2025', '28/04/2025',
    '29/04/2025', '30/04/2025'
  ];

  readonly customColorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#9b2226', '#bb3e03', '#e9d8a6', '#ee9b00', '#94d2bd', '#0a9396']
  };

  readonly customHeatScheme: Color = {
    ...this.customColorScheme,
    domain: [...this.customColorScheme.domain].reverse()
  };

  constructor(private readonly pokemonService: PokemonGraphqlService) {}

  ngOnInit(): void {
    this.pokemonService.getPokemons()
      .pipe(map(this.transformPokemonData))
      .subscribe(data => this.data = data);

    this.pokemonService.getPokemonsWithAttacks().subscribe(pokemons => {
      this.heatmapData = pokemons.map(this.buildHeatmapEntry.bind(this));
      this.originalHeatmapData = [...this.heatmapData];
      this.filteredHeatmapData = [...this.heatmapData];
      this.pieChartData = this.buildPieChartData(pokemons);
    });
  }

  ngAfterViewInit(): void {
    const width = this.chartContainer.nativeElement.offsetWidth;
    this.view = [width, 400];
  }

  private buildHeatmapEntry(pokemon: any): HeatmapData {
    const attacks = [...(pokemon.attacks?.fast ?? []), ...(pokemon.attacks?.special ?? [])];
    const totalDamage = attacks.reduce((sum, atk) => sum + (atk.damage ?? 0), 0);
    const series = totalDamage
      ? this.distributeDamageAcrossDates(totalDamage, this.DATES)
      : this.DATES.map(date => ({ name: date, value: 0 }));

    return { name: pokemon.name, series };
  }

  private buildPieChartData(pokemons: any[]): { name: string; value: number }[] {
    return pokemons.map(p => ({
      name: p.name,
      value: (p.attacks?.fast?.length ?? 0) + (p.attacks?.special?.length ?? 0)
    }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }

  private transformPokemonData(pokemons: any[]): { name: string; value: number }[] {
    const weightMap = pokemons.reduce<Map<string, { name: string; weight: number }>>((map, { name, weight, types }) => {
      const maxWeight = parseFloat(weight?.maximum?.replace(/[^\d.]/g, '') ?? '0');
      types?.forEach((type: string) => {
        const current = map.get(type);
        if (!current || maxWeight > current.weight) {
          map.set(type, { name, weight: maxWeight });
        }
      });
      return map;
    }, new Map());

    return Array.from(weightMap.entries())
      .map(([type, { name, weight }]) => ({ name: `${type} (${name})`, value: weight }))
      .sort((a, b) => b.value - a.value);
  }

  private distributeDamageAcrossDates(total: number, dates: string[]): { name: string, value: number }[] {
    const result = [];
    let remaining = total;

    for (let i = 0; i < dates.length; i++) {
      if (i === dates.length - 1) {
        result.push({ name: dates[i], value: remaining });
      } else {
        const value = Math.floor(Math.random() * (remaining / 2));
        result.push({ name: dates[i], value });
        remaining -= value;
      }
    }

    return result;
  }

  private toDate(str: string): Date {
    return new Date(str.split('/').reverse().join('-'));
  }

  applyFilters(): void {
    const start = this.startDate ? new Date(this.startDate) : new Date('2000-01-01');
    const end = this.endDate ? new Date(this.endDate) : new Date('2100-01-01');
    this.selectedDateRange = [start.toLocaleDateString('pt-BR'), end.toLocaleDateString('pt-BR')];

    const selectedNames = this.selectedPokemon ? [this.selectedPokemon] : [];

    this.filteredHeatmapData = this.originalHeatmapData
      .filter(p => !selectedNames.length || selectedNames.includes(p.name))
      .map(p => ({
        name: p.name,
        series: p.series.filter(s => {
          const date = this.toDate(s.name);
          return date >= start && date <= end && s.value >= this.minDamage;
        })
      }));
  }

  resetFilters(): void {
    this.selectedPokemon = '';
    this.startDate = '2025-04-17';
    this.endDate = '2025-04-30';
    this.minDamage = 0;
    this.filteredHeatmapData = [...this.originalHeatmapData];
  }

  formatValue(value: number): string {
    return `${value} kg`;
  }

  onTooltipActivate(event: any): void {
    event.tooltip = `${event.value} kg`;
  }

  onTooltipDeactivate(event: any): void {
    event.tooltip = '';
  }
}

import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { Ods13Component } from './features/ods13/ods13.component';
import { AcoesComponent } from './features/acoes/acoes.component';
import { DadosComponent } from './features/dados/dados.component';
import { ContatoComponent } from './features/contato/contato.component';
import { RecursosComponent } from './features/recursos/recursos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'ods13', component: Ods13Component },
  { path: 'acoes', component: AcoesComponent },
  { path: 'dados', component: DadosComponent },
  { path: 'contato', component: ContatoComponent },
  { path: 'recursos', component: RecursosComponent }
];
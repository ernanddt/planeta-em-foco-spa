import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalculadoraModalComponent } from './calculadora-modal/calculadora-modal.component';

@Component({
  selector: 'app-acoes',
  standalone: true,
  imports: [CommonModule, RouterModule, CalculadoraModalComponent],
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.scss']
})
export class AcoesComponent {
  showCalculatorModal = false;
}
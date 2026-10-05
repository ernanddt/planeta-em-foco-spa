import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-calculadora-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./calculadora-modal.component.html",
  styleUrls: ["./calculadora-modal.component.scss"],
})
export class CalculadoraModalComponent implements AfterViewInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  // Transporte
  vehicleType = "car"; // car, motorcycle
  vehicleKmPerMonth = 0;

  // Energia
  electricityKwhPerMonth = 0;
  electricitySource = "grid"; // grid, solar, wind, hydro

  // Alimentação
  dietType = "omnivore"; // omnivore, vegetarian, vegan
  beefMealsPerWeek = 0;
  dairyServingsPerDay = 0;

  // Consumo
  goodsServicesSpendPerMonth = 0; // in local currency (simplified)
  wasteRecycling = false; // whether they recycle

  // Results
  resultado = 0; // em kg CO2/mês
  transporteEmission = 0; // em kg CO2/mês
  energiaEmission = 0; // em kg CO2/mês
  alimentacaoEmission = 0; // em kg CO2/mês
  consumoEmission = 0; // em kg CO2/mês
  feedback = "";
  cor = "";
  showNoDataWarning = false;
  showBreakdown = false;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    if (this.visible) {
      this.focusFirstInput();
    }
  }

  ngOnChanges() {
    if (this.visible) {
      setTimeout(() => this.focusFirstInput(), 0);
    }
  }

  focusFirstInput() {
    const firstInput = document.querySelector(
      ".modal-content input, .modal-content select",
    );
    if (firstInput) {
      (firstInput as HTMLElement).focus();
    }
  }

  // Verifica se ha algum dado informado (pelo menos um input nao-zero)
  hasDataProvided(): boolean {
    return (
      this.vehicleKmPerMonth > 0 ||
      this.electricityKwhPerMonth > 0 ||
      this.beefMealsPerWeek > 0 ||
      this.dairyServingsPerDay > 0 ||
      this.goodsServicesSpendPerMonth > 0
    );
  }

  calcular() {
    // Validate: check if any data was provided
    const hasData = this.hasDataProvided();

    if (!hasData) {
      // Show warning but allow user to continue
      this.showNoDataWarning = true;
      // Reset results to 0 when no data
      this.resultado = 0;
      this.transporteEmission = 0;
      this.energiaEmission = 0;
      this.alimentacaoEmission = 0;
      this.consumoEmission = 0;
      this.feedback = "";
      this.showBreakdown = false;
      return;
    }

    // Hide warning if previously shown and now has data
    this.showNoDataWarning = false;
    this.showBreakdown = true;

    // --- Transporte ---
    // Fatores MCTI Brazil: kg CO2 por km
    // Carro: ~0.23 kg CO2/km (2.3 kg CO2/L ÷ 10 km/L consumo médio)
    // Moto: ~0.08 kg CO2/km (1.2 kg CO2/L ÷ 15 km/L consumo médio)
    if (this.vehicleType === "car") {
      this.transporteEmission = this.vehicleKmPerMonth * 0.23;
    } else if (this.vehicleType === "motorcycle") {
      this.transporteEmission = this.vehicleKmPerMonth * 0.08;
    }

    // --- Energia ---
    // Fator médio SIN Brazil (MCTI): 0.04-0.10 kg CO2/kWh → usamos 0.07 kg CO2/kWh médio
    // Fonte: https://mangue.tech/blog/fatores-emissao-brasil-mcti-ipcc-guia
    if (this.electricitySource === "solar") {
      this.energiaEmission = this.electricityKwhPerMonth * 0.01; // solar ~10g CO2/kWh
    } else if (this.electricitySource === "wind") {
      this.energiaEmission = this.electricityKwhPerMonth * 0.005; // eólica ~5g CO2/kWh
    } else if (this.electricitySource === "hydro") {
      this.energiaEmission = this.electricityKwhPerMonth * 0.003; // hidrelétrica ~3g CO2/kWh
    } else {
      // Grid médio nacional (MCTI - Location-based histórico)
      this.energiaEmission = this.electricityKwhPerMonth * 0.07;
    }

    // --- Alimentação ---
    // Estimativas baseadas em médias do Programa Brasileiro GHG Protocol / IPCC AR6
    // Dieta onívora brasileira média estimada em ~1.2 tCO2/ano (resultando em 100 kg CO2/mês)
    // Thresholds de feedback ajustados para kg CO2/mês
    if (this.dietType === "omnivore") {
      this.alimentacaoEmission = 100; // 100 kg CO2/mês base dieta onívora
    } else if (this.dietType === "vegetarian") {
      this.alimentacaoEmission = 50; // Redução estimada de ~50%
    } else if (this.dietType === "vegan") {
      this.alimentacaoEmission = 25; // Redução estimada de ~75%
    }

    // Impacto adicional: cada refeição com carne bovina
    // IPCC AR6 Brazil: carne bovina ~15 kg CO2/kg carcaça
    // Refeição média usa ~0.15 kg CO2 (produção + cocção)
    // Converter para kg CO2/mês: 0.15 kg CO2/meal × (4,35 weeks/month ÷ 1 week input)
    // Ajuste: input beefMealsPerWeek (por semana) tem impacto significativo
    const beefKgCO2PerMeal = 0.15; // kg CO2 por refeição
    this.alimentacaoEmission += this.beefMealsPerWeek * beefKgCO2PerMeal * 4.35; // weekly to monthly approx

    // Laticínios: porções de leite e derivados
    // Produção de leite: ~2.5 kg CO2/L; porção média ~0.2 L equivalência
    // 0.2 kg CO2 por porção
    const dairyKgCO2PerServing = 0.2; // kg CO2 por porção dia
    this.alimentacaoEmission +=
      this.dairyServingsPerDay * dairyKgCO2PerServing * 30; // daily to monthly

    // --- Consumo ---
    // Fator aproximado: estudo FGV/SESUB / Programa Brasileiro GHG Protocol
    // R$ 1,00 gasto → ~0.03g CO2 = 0.00003 kg CO2
    // Para gastos brasileiros médios (~R$ 1000/mês), queremos ~2 kg CO2/mês desse rubro
    // Fator: 0.002 kg CO2 por Real gasto (2 miligros CO2 por real)
    this.consumoEmission = this.goodsServicesSpendPerMonth * 0.002;

    // Adjust for recycling (reduces emissions by ~20% - dado oficial MCTI)
    if (this.wasteRecycling) {
      this.consumoEmission = this.consumoEmission * 0.8;
    }

    // Total (kg CO2/mês)
    this.resultado =
      this.transporteEmission +
      this.energiaEmission +
      this.alimentacaoEmission +
      this.consumoEmission;
    this.setFeedback();
  }

  setFeedback() {
    // Thresholds em kg CO2/mês (mais adequados para cálculo mensal)
    // < 50 kg CO2/mês = EXCELENTE (≈ 600 kg/ano, abaixo da média brasileira)
    // < 100 kg CO2/mês = BOM (≈ 1200 kg/ano)
    // < 150 kg CO2/mês = MÉDIO (≈ 1800 kg/ano)
    // < 200 kg CO2/mês = ALTO (≈ 2400 kg/ano)
    // >= 200 kg CO2/mês = MUITO ALTO (≈ mais de 2400 kg/ano)
    if (this.resultado < 50) {
      this.feedback = "EXCELENTE!";
      this.cor = "#00a86b";
    } else if (this.resultado < 100) {
      this.feedback = "BOM!";
      this.cor = "#7cb342";
    } else if (this.resultado < 150) {
      this.feedback = "MÉDIO!";
      this.cor = "#fbc02d";
    } else if (this.resultado < 200) {
      this.feedback = "ALTO";
      this.cor = "#f57c00";
    } else {
      this.feedback = "MUITO ALTO";
      this.cor = "#d32f2f";
    }
  }

  // Fechar o modal
  fechar() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    // Reset warning when closing
    this.showNoDataWarning = false;
  }

  // Zerar dados informados
  limparDados() {
    this.vehicleKmPerMonth = 0;
    this.electricityKwhPerMonth = 0;
    this.dietType = "omnivore";
    this.beefMealsPerWeek = 0;
    this.dairyServingsPerDay = 0;
    this.goodsServicesSpendPerMonth = 0;
    this.wasteRecycling = false;
    this.showNoDataWarning = false;
    this.showBreakdown = false;
    this.resultado = 0;
    this.transporteEmission = 0;
    this.energiaEmission = 0;
    this.alimentacaoEmission = 0;
    this.consumoEmission = 0;
    this.feedback = "";
  }

  // Navegar para ações
  verAcoes() {
    this.fechar();
    this.router.navigate(["/acoes"]);
  }
}

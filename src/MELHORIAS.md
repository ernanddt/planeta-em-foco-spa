# 📋 Relatório de Melhorias - Planeta em Foco (Nota 2)

## Melhorias Prioritárias (Implementadas nesta Nota)

### ✅ [FEITO] Seção Gráficos com Fetch API
- Gráficos de CO₂ e Temperatura implementados
- Consumo de Open-Meteo Climate API
- Fallback com dados hardcoded
- Indicador visual de origem dos dados

### ✅ [FEITO] Calculadora de Pegada de Carbono
- Modal com 5 categorias de cálculo
- Sistema de gradação (5 níveis)
- Feedback personalizado
- Redirecionamento para /acoes

## Melhorias Pendentes (Não Implementadas)

### 🔴 [PENDENTE] Layout e Estilização
**Descrição:** Polimento geral dos componentes
**Impacto:** Visual + UX
**Tempo estimado:** 4-6 horas
**Por quê:** Falta de tempo na Nota 2

**Melhorias específicas:**
- Aumentar espaçamento vertical (padding)
- Melhorar contraste de cores em cards
- Animações de transição nos hover
- Responsividade mobile refinada

---

### 🟠 [RECOMENDADO] Cards dos ODS na HOME
**Descrição:** Substituir números por ícones visuais + hover interativo
**Impacto:** Engajamento + Acessibilidade
**Tempo estimado:** 2-3 horas
**Por quê:** Falta de tempo

**Implementação sugerida:**
- Substituir texto numérico (1, 2, 3...) por ícones
- Ícones estão em: src/assets/images/icones-ods/
- Adicionar hover card com detalhamento de cada ODS
- Estrutura similar à página /ods13

---

### 🟠 [RECOMENDADO] Página Recursos
**Descrição:** Completar redirecionamentos de conteúdo
**Impacto:** Funcionalidade
**Tempo estimado:** 1-2 horas
**Por quê:** Falta de tempo

**Itens pendentes:**
- [ ] Links para vídeos (YouTube/Vimeo)
- [ ] Download de Guia de Sustentabilidade (PDF)
- [ ] Planilha de Emissões (Excel/Google Sheets)
- [ ] Infográficos ODS (PNG/SVG)

**Fonte de conteúdo:**
- Site oficial ODS: https://sdgs.un.org/
- PNUD Brasil: https://www.br.undp.org/content/brazil/pt/home/sustainable-development-goals.html

---

### 🔵 [BAIXA PRIORIDADE] Formulário de Contato
**Descrição:** Implementar envio de mensagens via JavaScript
**Impacto:** Funcionalidade
**Tempo estimado:** 1-2 horas
**Por quê:** Requer backend ou serviço de email

**Opções de implementação:**
1. **EmailJS** (Recomendado)
   - Gratuito até 200 emails/mês
   - Sem backend necessário
   - Tempo: 30 min

2. **Formspree**
   - Gratuito até 50 submissões/mês
   - Redireciona para email
   - Tempo: 15 min

3. **Backend próprio**
   - Node.js + Nodemailer
   - Mais controle
   - Tempo: 2-3 horas

---

## Outros Ajustes Identificados

### Performance
- [ ] Lazy loading de imagens em cards
- [ ] Minificação de assets
- [ ] Cache de HTTP (precisa de servidor)

### Acessibilidade
- [ ] Adicionar skip links
- [ ] ARIA labels em modais
- [ ] Suporte a modo escuro (preferências do SO)

### SEO
- [ ] Meta tags para ODS
- [ ] Open Graph (redes sociais)
- [ ] Sitemap XML

---

## Priorização (Para Próximas Notas)

| Tarefa | Impacto | Tempo | Prioridade |
|--------|---------|-------|-----------|
| Ícones ODS + Hover | Alto | 2-3h | 🟢 Alta |
| Formulário Contato | Médio | 1-2h | 🟢 Alta |
| Página Recursos | Médio | 1-2h | 🟢 Alta |
| Polimento Layout | Médio | 4-6h | 🟡 Média |
| Performance | Baixo | 2-3h | 🔵 Baixa |
| Acessibilidade | Médio | 2-3h | 🟡 Média |
| SEO | Baixo | 1-2h | 🔵 Baixa |

---

**Gerado automaticamente:** 25/09/2026
**Próxima revisão:** Após apresentação Nota 3
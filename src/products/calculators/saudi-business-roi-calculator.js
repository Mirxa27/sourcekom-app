/**
 * SourceKom Saudi Business ROI Calculator
 * Advanced financial analysis tool for Saudi businesses
 * Calculates ROI, break-even analysis, and profitability projections
 */

class SaudiBusinessROICalculator {
  constructor() {
    this.businessMetrics = {
      revenue: { monthly: 0, annual: 0, growth: 0 },
      costs: {
        personnel: { monthly: 0, annual: 0 },
        facilities: { monthly: 0, annual: 0 },
        marketing: { monthly: 0, annual: 0 },
        technology: { monthly: 0, annual: 0 },
        compliance: { monthly: 0, annual: 0 },
        other: { monthly: 0, annual: 0 }
      },
      investments: {
        initial: 0,
        workingCapital: 0,
        equipment: 0,
        technology: 0,
        marketing: 0,
        other: 0
      }
    };
    
    this.saudiFactors = {
      vatRate: 0.15, // 15% VAT
      corporateTax: 0.20, // 20% corporate tax for foreign companies
      zakatRate: 0.025, // 2.5% Zakat for Saudi companies
      saudizationTarget: 0.30, // 30% Saudi workforce target
      minimumWage: 4000, // SAR 4,000 minimum wage
      workingDaysPerMonth: 22, // Average working days (excluding Friday)
      saudiBusinessDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
    };
    
    this.projections = {
      revenue: [],
      costs: [],
      profitability: [],
      cashFlow: [],
      roi: [],
      breakEven: null
    };
    
    this.scenarios = [];
  }

  // Set business metrics
  setBusinessMetrics(metrics) {
    this.businessMetrics = { ...this.businessMetrics, ...metrics };
    this.calculateAnnualValues();
    return this.calculateROI();
  }

  // Calculate annual values from monthly inputs
  calculateAnnualValues() {
    const { revenue, costs } = this.businessMetrics;
    
    // Revenue calculations
    revenue.annual = revenue.monthly * 12;
    
    // Cost calculations
    Object.keys(costs).forEach(costCategory => {
      if (costCategory !== 'total') {
        costs[costCategory].annual = costs[costCategory].monthly * 12;
      }
    });
    
    // Calculate total costs
    costs.total = {
      monthly: Object.values(costs).reduce((sum, cost) => sum + cost.monthly, 0),
      annual: Object.values(costs).reduce((sum, cost) => sum + cost.annual, 0)
    };
  }

  // Calculate comprehensive ROI analysis
  calculateROI() {
    const { revenue, costs, investments } = this.businessMetrics;
    const totalInvestment = Object.values(investments).reduce((sum, inv) => sum + inv, 0);
    
    // Annual profit before tax
    const annualProfit = revenue.annual - costs.total.annual;
    
    // Tax calculations
    const taxCalculations = this.calculateTaxes(annualProfit);
    
    // Net annual profit
    const netProfit = annualProfit - taxCalculations.totalTax;
    
    // ROI calculations
    const basicROI = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
    const paybackPeriod = totalInvestment > 0 ? totalInvestment / netProfit : 0;
    
    // Monthly cash flow
    const monthlyCashFlow = (netProfit / 12);
    
    // Break-even analysis
    const breakEvenAnalysis = this.calculateBreakEven();
    
    // Saudi-specific metrics
    const saudiMetrics = this.calculateSaudiMetrics();
    
    return {
      basicROI: basicROI.toFixed(2),
      annualProfit: annualProfit.toFixed(2),
      netProfit: netProfit.toFixed(2),
      monthlyCashFlow: monthlyCashFlow.toFixed(2),
      paybackPeriod: paybackPeriod.toFixed(2),
      totalInvestment: totalInvestment.toFixed(2),
      totalAnnualCosts: costs.total.annual.toFixed(2),
      taxCalculations,
      breakEvenAnalysis,
      saudiMetrics,
      profitability: {
        grossMargin: ((annualProfit / revenue.annual) * 100).toFixed(2),
        netMargin: ((netProfit / revenue.annual) * 100).toFixed(2),
        operatingMargin: ((annualProfit / revenue.annual) * 100).toFixed(2)
      },
      recommendations: this.generateRecommendations(basicROI, paybackPeriod, saudiMetrics)
    };
  }

  // Calculate taxes for Saudi businesses
  calculateTaxes(profit) {
    const { vatRate, corporateTax, zakatRate } = this.saudiFactors;
    
    // VAT calculation (15% on revenue, but VAT is typically passed to customers)
    const vatLiability = this.businessMetrics.revenue.annual * vatRate;
    
    // Corporate tax (20% for foreign companies)
    const corporateTax = profit * corporateTax;
    
    // Zakat (2.5% for Saudi companies)
    const zakat = profit * zakatRate;
    
    // For this calculator, we'll assume mixed company structure
    const totalTax = corporateTax * 0.7 + zakat * 0.3; // 70% foreign, 30% Saudi ownership assumption
    
    return {
      vatLiability: vatLiability.toFixed(2),
      corporateTax: corporateTax.toFixed(2),
      zakat: zakat.toFixed(2),
      totalTax: totalTax.toFixed(2),
      effectiveTaxRate: ((totalTax / profit) * 100).toFixed(2)
    };
  }

  // Calculate break-even analysis
  calculateBreakEven() {
    const { revenue, costs } = this.businessMetrics;
    const fixedCosts = costs.facilities.annual + costs.technology.annual + costs.other.annual;
    const variableCosts = costs.personnel.annual + costs.marketing.annual + costs.compliance.annual;
    
    // Contribution margin per revenue unit
    const contributionMargin = revenue.annual - variableCosts;
    const contributionMarginRatio = (contributionMargin / revenue.annual) * 100;
    
    // Break-even revenue
    const breakEvenRevenue = fixedCosts / (contributionMarginRatio / 100);
    const breakEvenUnits = breakEvenRevenue / (revenue.annual / this.estimateAnnualUnits());
    
    // Break-even time (in months)
    const breakEvenMonths = (breakEvenRevenue / revenue.annual) * 12;
    
    return {
      fixedCosts: fixedCosts.toFixed(2),
      variableCosts: variableCosts.toFixed(2),
      contributionMargin: contributionMargin.toFixed(2),
      contributionMarginRatio: contributionMarginRatio.toFixed(2),
      breakEvenRevenue: breakEvenRevenue.toFixed(2),
      breakEvenUnits: Math.ceil(breakEvenUnits),
      breakEvenMonths: breakEvenMonths.toFixed(1),
      breakEvenDate: this.calculateBreakEvenDate(breakEvenMonths)
    };
  }

  // Calculate Saudi-specific business metrics
  calculateSaudiMetrics() {
    const { costs, revenue } = this.businessMetrics;
    const { saudizationTarget, minimumWage } = this.saudiFactors;
    
    // Saudization compliance cost
    const estimatedEmployees = Math.ceil(costs.personnel.annual / 8000); // Assuming avg salary of 8k
    const requiredSaudiEmployees = Math.ceil(estimatedEmployees * saudizationTarget);
    const saudizationGap = Math.max(0, requiredSaudiEmployees - Math.floor(estimatedEmployees * 0.2)); // Assuming current 20% Saudi
    const saudizationPenalty = saudizationGap * 100000; // Estimate: SAR 100k per missing Saudi employee
    
    // Minimum wage compliance
    const minimumWageGap = Math.max(0, 4000 - (costs.personnel.annual / estimatedEmployees)) * estimatedEmployees;
    
    // Saudi market opportunities
    const vision2030Opportunities = revenue.annual * 0.15; // 15% growth opportunity from Vision 2030
    const localizationBonus = requiredSaudiEmployees * 5000; // Government bonus for Saudi employment
    
    return {
      estimatedEmployees,
      requiredSaudiEmployees,
      saudizationGap,
      saudizationPenalty: saudizationPenalty.toFixed(2),
      minimumWageGap: minimumWageGap.toFixed(2),
      vision2030Opportunities: vision2030Opportunities.toFixed(2),
      localizationBonus: localizationBonus.toFixed(2),
      saudiMarketAdvantage: (vision2030Opportunities + localizationBonus - saudizationPenalty).toFixed(2),
      complianceStatus: saudizationGap <= 0 ? 'Compliant' : 'Non-Compliant'
    };
  }

  // Estimate annual units sold/services provided
  estimateAnnualUnits() {
    const { revenue } = this.businessMetrics;
    // This is a simplified calculation - in reality would depend on business type
    return Math.ceil(revenue.annual / 1000); // Assuming average unit/service value of SAR 1,000
  }

  // Calculate break-even date
  calculateBreakEvenDate(months) {
    const startDate = new Date();
    const breakEvenDate = new Date(startDate);
    breakEvenDate.setMonth(breakEvenDate.getMonth() + Math.ceil(months));
    return breakEvenDate.toISOString().split('T')[0];
  }

  // Generate 5-year projections
  generateProjections(growthRate = 0.15, inflationRate = 0.02) {
    const { revenue, costs } = this.businessMetrics;
    const projections = [];
    
    for (let year = 1; year <= 5; year++) {
      const revenueGrowth = Math.pow(1 + growthRate, year - 1);
      const costInflation = Math.pow(1 + inflationRate, year - 1);
      
      const projectedRevenue = revenue.annual * revenueGrowth;
      const projectedCosts = costs.total.annual * costInflation;
      const projectedProfit = projectedRevenue - projectedCosts;
      
      projections.push({
        year,
        revenue: projectedRevenue.toFixed(2),
        costs: projectedCosts.toFixed(2),
        profit: projectedProfit.toFixed(2),
        roi: ((projectedProfit / this.businessMetrics.investments.initial) * 100).toFixed(2),
        cashFlow: (projectedProfit / 12).toFixed(2)
      });
    }
    
    return projections;
  }

  // Scenario analysis
  runScenarioAnalysis(scenarios) {
    const results = [];
    const baseMetrics = JSON.parse(JSON.stringify(this.businessMetrics));
    
    scenarios.forEach((scenario, index) => {
      // Apply scenario changes
      this.businessMetrics = { ...baseMetrics, ...scenario.changes };
      this.calculateAnnualValues();
      
      const result = this.calculateROI();
      results.push({
        name: scenario.name,
        ...result,
        assumptions: scenario.assumptions || {}
      });
    });
    
    // Restore original metrics
    this.businessMetrics = baseMetrics;
    this.calculateAnnualValues();
    
    return results;
  }

  // Generate recommendations
  generateRecommendations(roi, paybackPeriod, saudiMetrics) {
    const recommendations = [];
    
    // ROI-based recommendations
    if (roi < 10) {
      recommendations.push({
        type: 'warning',
        priority: 'high',
        title: 'Low ROI Detected',
        description: 'Current ROI is below 10%. Consider reviewing cost structure or increasing revenue streams.',
        actions: ['Reduce overhead costs', 'Increase pricing', 'Expand market reach', 'Optimize operations']
      });
    } else if (roi > 50) {
      recommendations.push({
        type: 'success',
        priority: 'medium',
        title: 'Excellent ROI Performance',
        description: 'ROI exceeds 50%. Consider scaling operations and expanding market presence.',
        actions: ['Scale operations', 'Market expansion', 'Invest in growth', 'Diversify offerings']
      });
    }
    
    // Payback period recommendations
    if (paybackPeriod > 5) {
      recommendations.push({
        type: 'warning',
        priority: 'high',
        title: 'Long Payback Period',
        description: 'Payback period exceeds 5 years. Focus on improving cash flow and reducing initial investment.',
        actions: ['Reduce initial investment', 'Increase monthly profit margin', 'Optimize working capital', 'Consider financing options']
      });
    }
    
    // Saudization recommendations
    if (saudiMetrics.complianceStatus === 'Non-Compliant') {
      recommendations.push({
        type: 'alert',
        priority: 'critical',
        title: 'Saudization Non-Compliance',
        description: `Gap of ${saudiMetrics.saudizationGap} Saudi employees detected. Potential penalties: SAR ${saudiMetrics.saudizationPenalty}`,
        actions: ['Hire Saudi nationals', 'Implement training programs', 'Adjust recruitment strategy', 'Apply for government incentives']
      });
    }
    
    // Saudi market opportunity recommendations
    if (parseFloat(saudiMetrics.saudiMarketAdvantage) > 0) {
      recommendations.push({
        type: 'opportunity',
        priority: 'medium',
        title: 'Saudi Market Opportunities',
        description: `Potential advantage of SAR ${saudiMetrics.saudiMarketAdvantage} from Vision 2030 initiatives and localization.`,
        actions: ['Apply for government incentives', 'Target government contracts', 'Partner with Saudi companies', 'Invest in Saudi talent']
      });
    }
    
    // General Saudi business recommendations
    recommendations.push(
      {
        type: 'info',
        priority: 'low',
        title: 'Saudi Calendar Optimization',
        description: 'Align operations with Saudi business calendar and working hours.',
        actions: ['Schedule meetings Sat-Thu', 'Account for Ramadan hours', 'Plan for Friday weekend', 'Observe Saudi holidays']
      },
      {
        type: 'info',
        priority: 'low',
        title: 'Digital Transformation',
        description: 'Leverage Saudi digital transformation initiatives.',
        actions: ['Implement e-government services', 'Use Saudi fintech solutions', 'Adopt digital payment systems', 'Integrate with Saudi platforms']
      }
    );
    
    return recommendations;
  }

  // Export results to various formats
  exportResults(format = 'json') {
    const results = this.calculateROI();
    
    switch (format) {
      case 'json':
        return JSON.stringify(results, null, 2);
      case 'csv':
        return this.generateCSVReport(results);
      case 'pdf':
        return this.generatePDFReport(results);
      default:
        return results;
    }
  }

  // Generate CSV report
  generateCSVReport(results) {
    const headers = ['Metric', 'Value', 'Unit', 'Description'];
    const rows = [
      ['Annual Revenue', results.totalAnnualCosts, 'SAR', 'Total annual revenue'],
      ['Annual Costs', results.totalAnnualCosts, 'SAR', 'Total annual operating costs'],
      ['Annual Profit', results.annualProfit, 'SAR', 'Profit before tax'],
      ['Net Annual Profit', results.netProfit, 'SAR', 'Profit after tax'],
      ['Monthly Cash Flow', results.monthlyCashFlow, 'SAR', 'Monthly net cash flow'],
      ['ROI', results.basicROI, '%', 'Return on investment'],
      ['Payback Period', results.paybackPeriod, 'Years', 'Time to recover investment'],
      ['Total Investment', results.totalInvestment, 'SAR', 'Initial investment required'],
      ['Gross Margin', results.profitability.grossMargin, '%', 'Gross profit margin'],
      ['Net Margin', results.profitability.netMargin, '%', 'Net profit margin'],
      ['Break-even Revenue', results.breakEvenAnalysis.breakEvenRevenue, 'SAR', 'Revenue needed to break even'],
      ['Break-even Months', results.breakEvenAnalysis.breakEvenMonths, 'Months', 'Time to break even'],
      ['Saudi Employees Required', results.saudiMetrics.requiredSaudiEmployees, 'People', 'Saudization requirement'],
      ['Saudi Market Advantage', results.saudiMetrics.saudiMarketAdvantage, 'SAR', 'Net advantage from Saudi market']
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\\n');
  }

  // Generate PDF report (simplified)
  generatePDFReport(results) {
    return {
      type: 'pdf',
      title: 'Saudi Business ROI Analysis Report',
      generated: new Date().toISOString(),
      data: results
    };
  }

  // Reset calculator
  reset() {
    this.businessMetrics = {
      revenue: { monthly: 0, annual: 0, growth: 0 },
      costs: {
        personnel: { monthly: 0, annual: 0 },
        facilities: { monthly: 0, annual: 0 },
        marketing: { monthly: 0, annual: 0 },
        technology: { monthly: 0, annual: 0 },
        compliance: { monthly: 0, annual: 0 },
        other: { monthly: 0, annual: 0 }
      },
      investments: {
        initial: 0,
        workingCapital: 0,
        equipment: 0,
        technology: 0,
        marketing: 0,
        other: 0
      }
    };
    this.projections = [];
    this.scenarios = [];
  }

  // Get Saudi business benchmarks
  getSaudiBenchmarks() {
    return {
      profitability: {
        averageROIBenchmark: 15.5, // Average ROI for Saudi businesses
        goodROIBenchmark: 25.0,  // Good ROI target
        excellentROIBenchmark: 40.0 // Excellent ROI target
      },
      costs: {
        personnelCostRatio: 0.45, // Personnel should be 45% of revenue
        facilityCostRatio: 0.15,  // Facilities should be 15% of revenue
        marketingCostRatio: 0.08, // Marketing should be 8% of revenue
        technologyCostRatio: 0.05, // Technology should be 5% of revenue
        complianceCostRatio: 0.03 // Compliance should be 3% of revenue
      },
      saudiSpecific: {
        saudizationTarget: 0.30,    // 30% Saudi workforce target
        minimumWage: 4000,          // SAR 4,000 minimum wage
        vatRate: 0.15,              // 15% VAT rate
        workingDaysPerMonth: 22     // Average working days
      }
    };
  }

  // Compare against benchmarks
  compareWithBenchmarks() {
    const results = this.calculateROI();
    const benchmarks = this.getSaudiBenchmarks();
    const comparison = {};
    
    // ROI comparison
    const roi = parseFloat(results.basicROI);
    comparison.roi = {
      current: roi,
      benchmark: benchmarks.profitability.averageROIBenchmark,
      performance: roi >= benchmarks.profitability.excellentROIBenchmark ? 'Excellent' :
                    roi >= benchmarks.profitability.goodROIBenchmark ? 'Good' :
                    roi >= benchmarks.profitability.averageROIBenchmark ? 'Average' : 'Below Average'
    };
    
    // Cost structure comparison
    const revenue = parseFloat(results.totalAnnualCosts);
    Object.keys(benchmarks.costs).forEach(costCategory => {
      const actualRatio = this.businessMetrics.costs[costCategory].annual / revenue;
      const benchmarkRatio = benchmarks.costs[costCategory];
      comparison[costCategory] = {
        current: (actualRatio * 100).toFixed(1),
        benchmark: (benchmarkRatio * 100).toFixed(1),
        performance: Math.abs(actualRatio - benchmarkRatio) < 0.02 ? 'On Target' :
                     actualRatio > benchmarkRatio ? 'Above Target' : 'Below Target'
      };
    });
    
    return comparison;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SaudiBusinessROICalculator;
} else if (typeof window !== 'undefined') {
  window.SaudiBusinessROICalculator = SaudiBusinessROICalculator;
}
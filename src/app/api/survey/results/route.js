import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CONCERNS_LABELS = {
  water:           'Water supply / wells',
  power_grid:      'Power grid & rate hikes',
  noise:           'Noise pollution',
  ag_land:         'Agricultural land & rural character',
  property_values: 'Property values',
  visual:          'Visual impact',
  no_concerns:     'No major concerns',
  other:           'Other',
}

const BENEFITS_LABELS = {
  tax_revenue:       'Local tax revenue',
  construction_jobs: 'Construction jobs',
  tech_jobs:         'Long-term tech jobs',
  infrastructure:    'Infrastructure funding',
  no_benefits:       'No significant benefits',
  other:             'Other',
}

const ZONING_SHORT = {
  'Strictly in existing Industrial Zones: They should not be allowed to encroach on agricultural or residential land.':
    'Industrial zones only',
  'Case-by-Case Basis: They should be allowed in Agricultural/Rural areas only if they meet strict environmental and aesthetic criteria.':
    'Case-by-case (rural w/ restrictions)',
  'Anywhere: The free market and property owners should dictate land use.':
    'Anywhere — free market',
  'Nowhere: Frederick County should pause or ban all future data center development.':
    'Nowhere — pause or ban',
}

function tally(arr) {
  return arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})
}

function toSortedArray(obj, labelMap) {
  return Object.entries(obj)
    .map(([key, count]) => ({ label: labelMap ? (labelMap[key] || key) : key, count }))
    .sort((a, b) => b.count - a.count)
}

export async function GET() {
  try {
    // Select only non-PII columns
    const { data, error } = await supabase
      .from('survey_responses')
      .select('overall_stance, concerns, benefits, zoning_preference, ag_importance, tax_increase_favor, district')

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 })
    }

    const total = data.length

    if (total === 0) {
      return NextResponse.json({
        totalResponses: 0,
        fetchedAt: new Date().toISOString(),
        stanceDistribution: [],
        concernsDistribution: [],
        benefitsDistribution: [],
        zoningDistribution: [],
        agDistribution: { average: null, distribution: [] },
        taxDistribution: [],
        districtDistribution: [],
      })
    }

    // Stance — preserve meaningful order
    const stanceTally = tally(data.map(r => r.overall_stance).filter(Boolean))
    const STANCE_ORDER = ['Strongly Support', 'Somewhat Support', 'Neutral / Undecided', 'Somewhat Oppose', 'Strongly Oppose']
    const stanceDistribution = STANCE_ORDER.map(s => ({ label: s, count: stanceTally[s] || 0 }))

    // Concerns — flatten arrays, map IDs to labels, sort by frequency
    const allConcerns = data.flatMap(r => r.concerns || [])
    const concernsDistribution = toSortedArray(tally(allConcerns), CONCERNS_LABELS)

    // Benefits — same approach
    const allBenefits = data.flatMap(r => r.benefits || [])
    const benefitsDistribution = toSortedArray(tally(allBenefits), BENEFITS_LABELS)

    // Zoning — shorten labels, sort by frequency
    const zoningTally = tally(data.map(r => r.zoning_preference).filter(Boolean))
    const zoningDistribution = toSortedArray(zoningTally, ZONING_SHORT)

    // Ag importance — average + 1–10 distribution
    const agValues = data.map(r => r.ag_importance).filter(v => v != null)
    const agAverage = agValues.length
      ? Math.round((agValues.reduce((s, v) => s + v, 0) / agValues.length) * 10) / 10
      : null
    const agTally = tally(agValues.map(String))
    const agDistribution = {
      average: agAverage,
      distribution: Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        count: agTally[String(i + 1)] || 0,
      })),
    }

    // Tax increase favor
    const taxTally = tally(data.map(r => r.tax_increase_favor).filter(Boolean))
    const TAX_ORDER = [
      'Yes — I would support a modest tax increase as an alternative',
      'Unsure — I need more information before deciding',
      'No — I would not support a tax increase under any circumstances',
    ]
    const TAX_SHORT = {
      'Yes — I would support a modest tax increase as an alternative': 'Yes — support a tax increase',
      'Unsure — I need more information before deciding':              'Unsure — need more info',
      'No — I would not support a tax increase under any circumstances': 'No — oppose a tax increase',
    }
    const taxDistribution = TAX_ORDER
      .map(k => ({ label: TAX_SHORT[k], count: taxTally[k] || 0 }))

    // District — sort by frequency
    const districtTally = tally(data.map(r => r.district).filter(Boolean))
    const districtDistribution = toSortedArray(districtTally)

    return NextResponse.json({
      totalResponses: total,
      fetchedAt: new Date().toISOString(),
      stanceDistribution,
      concernsDistribution,
      benefitsDistribution,
      zoningDistribution,
      agDistribution,
      taxDistribution,
      districtDistribution,
    })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}

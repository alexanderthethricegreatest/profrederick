'use client'

import BudgetDashboard from '@/components/BudgetDashboard'
import styles from '@/styles/budget.module.css'

export default function BudgetPage() {
  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.wrapper}>
        <BudgetDashboard />
      </div>
    </main>
  )
}

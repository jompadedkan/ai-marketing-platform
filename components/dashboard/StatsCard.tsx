import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@iconify/react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  trend?: { value: string; positive: boolean }
}

export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 hover:border-primary/50 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-primary/10"><Icon icon={icon} className="w-5 h-5 text-primary" /></div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
        {trend && (<p className={`text-xs flex items-center gap-1 mt-2 ${trend.positive ? 'text-green-500' : 'text-red-500'}`}><Icon icon={trend.positive ? 'mdi:trending-up' : 'mdi:trending-down'} className="w-4 h-4" />{trend.value}</p>)}
      </CardContent>
    </Card>
  )
}

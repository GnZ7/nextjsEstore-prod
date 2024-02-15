import moment from 'moment'
import {translateDayToSpanish} from '@/utils/translateToSpanish'

const getGraphData = async () => {
  try {
    //Tomar rango de 7 días a partir del día actual
    const startDate = moment().subtract(6, 'days').startOf('day')
    const endDate = moment().endOf('day')

    //Query para traer de la BD las ordenes agrupadas por fecha
    const result = await prisma?.order.groupBy({
        by: ['createDate'],
        where:{
            createDate:{
                gte: startDate.toISOString(), //gte = greater than or equal
                lte: endDate.toISOString() // lte = lesser than or equal
            },
            status:'complete'
        },
        _sum:{
            amount:true
        }
    })

    //Objeto que contendrá la info de cada día del rango
    const aggregatedData: {
        [day: string]: {day: string; date: string; totalAmount: number}
    } = {}
    
    //Copia del día inicial, para iterar por cada día del rango
    const initialDate = startDate.clone()

    //Iterar por cada día, agregando la información
    while(initialDate <= endDate){
        const day = initialDate.format('dddd')
        
        //Agregar la info del día
        aggregatedData[day] = {
            day,
            date: initialDate.format('YYYY-MM-DD'),
            totalAmount: 0
        }
       
        //Pasar al siguiente día.
        initialDate.add(1, 'day')
    }

    //Agregar la suma total de cada día al array
    result?.forEach((entry) => {
        const day = moment(entry.createDate).format('dddd')
        const amount = entry._sum.amount != null ? Math.round( entry._sum.amount/100) : 0

        aggregatedData[day].totalAmount += amount
    })

    //Convertir aggregatedData de objeto a array para usarlo en el gráfico
    const formattedData = Object.values(aggregatedData).sort((a,b)=> moment(a.date).diff(moment(b.date)))

    return formattedData

  } catch (error: any) {
    
    throw new Error(error)
  }
}

export default getGraphData
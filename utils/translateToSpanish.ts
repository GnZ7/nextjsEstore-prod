export default function translateToSpanish (sentence: string): string {
  // Regular expression to match the pattern "X days ago" or "X months ago" where X is a number
  const regex: RegExp = /(\d+)\s+(day|month|year)s?\s+ago/gi

  // Function to replace the matched pattern with its Spanish equivalent
  function replaceMatch (match: string, number: string, unit: string): string {
    const spanishUnits: { [key: string]: string } = {
      day: 'día',
      month: 'mes',
      year: 'año'
    }

    const spanishUnit: string = spanishUnits[unit.toLowerCase()]
    return `Hace ${number} ${spanishUnit}${parseInt(number) !== 1 ? 's' : ''}`
  }

  // Replace matches in the sentence using the replace function with a callback
  const spanishSentence: string = sentence.replace(regex, replaceMatch)

  return spanishSentence
}

export function translateDayToSpanish (dayInEnglish:string):string{
  const dictionary: Record<string, string> = {
    'Monday': 'Lunes',
    'Tuesday': 'Martes',
    'Wednesday': 'Miércoles',
    'Thursday': 'Jueves',
    'Friday': 'Viernes',
    'Saturday': 'Sábado',
    'Sunday': 'Domingo'
  }
const dayInSpanish = dictionary[dayInEnglish] || dayInEnglish
return dayInSpanish
}
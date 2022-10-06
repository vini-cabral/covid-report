import moment from "moment"

export const PUB_BASE_URL = 'https://api.covid19api.com'
export const PUB_SLUG = 'brazil'
export const PUB_FROM = moment().add(-1*(+process.env.NEXT_PUBLIC_DAYS_AGO! || 2), 'days').format().substring(0, 10)
export const PUB_TO = moment().format().substring(0, 10)
export const PUB_CHART_DESC = 'deaths'
export const PUB_DATE_MIN = '2020-01-22'
export const PUB_DAYS_AGO = 4

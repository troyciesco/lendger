import formatMoney from '../../formatMoney'


it ('formats a number into currency', () => {
    let number = 10000
    expect(formatMoney(number)).toMatchSnapshot()
})
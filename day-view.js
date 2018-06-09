import React, { Component } from 'react'
import {
  View,
  Button,
  Text
} from 'react-native'
import styles from './styles'
import { formatDateForViewHeader } from './format'
import { bleeding as labels} from './labels'
import cycleDayModule from './get-cycle-day-number'
import { bleedingDaysSortedByDate } from './db'

const getCycleDay = cycleDayModule(bleedingDaysSortedByDate)

export default class DayView extends Component {
  constructor(props) {
    super(props)
    this.cycleDay = props.navigation.state.params.cycleDay
    this.state = {
      cycleDayNumber: getCycleDay(this.cycleDay.date),
    }
    bleedingDaysSortedByDate.addListener(setStateWithCurrentCycleDayNumber.bind(this))
  }

  componentWillUnmount() {
    bleedingDaysSortedByDate.removeListener(setStateWithCurrentCycleDayNumber)
  }

  render() {
    const navigate = this.props.navigation.navigate
    const day = this.cycleDay
    const bleedingValue = day.bleeding && day.bleeding.value
    let bleedingLabel
    if (typeof bleedingValue === 'number') {
      bleedingLabel = `Bleeding: ${labels[bleedingValue]}`
    } else {
      bleedingLabel = ''
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{formatDateForViewHeader(day.date)}</Text>
        <Text>Cycle day {getCycleDay(day.date)}</Text>
        <Text style={styles.welcome}>{bleedingLabel}</Text>
        <Button
          onPress={() => navigate('bleeding', { cycleDay: day })}
          title="Edit bleeding">
        </Button>
      </View >
    )
  }
}

function setStateWithCurrentCycleDayNumber() {
  this.setState({
    cycleDayNumber: getCycleDay(this.cycleDay.date)
  })
}
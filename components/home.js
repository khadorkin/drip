import React, { Component } from 'react'
import {
  View,
  Button,
  Text,
  ScrollView
} from 'react-native'
import { LocalDate, ChronoUnit } from 'js-joda'
import styles from '../styles/index'
import cycleModule from '../lib/cycle'
import { getOrCreateCycleDay, bleedingDaysSortedByDate, fillWithDummyData, deleteAll } from '../db'
import {bleedingPrediction as labels} from './labels'

const getCycleDayNumber = cycleModule().getCycleDayNumber

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.todayDateString = LocalDate.now().toString()
    const cycleDayNumber = getCycleDayNumber(this.todayDateString)

    this.state = {
      welcomeText: determineWelcomeText(cycleDayNumber),
      predictionText: determinePredictionText()
    }

    this.setStateWithCurrentText = (function (HomeComponent) {
      return function () {
        const cycleDayNumber = getCycleDayNumber(HomeComponent.todayDateString)
        HomeComponent.setState({
          welcomeText: determineWelcomeText(cycleDayNumber),
          predictionText: determinePredictionText()
        })
      }
    })(this)

    bleedingDaysSortedByDate.addListener(this.setStateWithCurrentText)
  }

  componentWillUnmount() {
    bleedingDaysSortedByDate.removeListener(this.setStateWithCurrentText)
  }

  passTodayToDayView() {
    const todayDateString = LocalDate.now().toString()
    const cycleDay = getOrCreateCycleDay(todayDateString)
    const navigate = this.props.navigate
    navigate('CycleDay', { cycleDay })
  }

  render() {
    return (
      <ScrollView>
        <Text style={styles.welcome}>{this.state.welcomeText}</Text>
        <Text style={styles.welcome}>{this.state.predictionText}</Text>
        <View style={styles.homeButtons}>
          <View style={styles.homeButton}>
            <Button
              onPress={() => this.passTodayToDayView()}
              title="Edit symptoms for today">
            </Button>
          </View>
          <View style={styles.homeButton}>
            <Button
              onPress={() => fillWithDummyData()}
              title="fill with example data">
            </Button>
          </View>
          <View style={styles.homeButton}>
            <Button
              onPress={() => deleteAll()}
              title="delete everything">
            </Button>
          </View>
        </View>
      </ScrollView>
    )
  }
}

function determineWelcomeText(cycleDayNumber) {
  const welcomeTextWithCycleDay = `Welcome! Today is day ${cycleDayNumber} of your current cycle`
  const welcomeText = `Welcome! We don't have enough information to know what your current cycle day is`
  return cycleDayNumber ? welcomeTextWithCycleDay : welcomeText
}

function determinePredictionText() {
  const bleedingPrediction = cycleModule().getPredictedMenses()
  if (!bleedingPrediction.length) return labels.noPrediction
  const todayDate = LocalDate.now()
  const bleedingStart = LocalDate.parse(bleedingPrediction[0][0])
  const bleedingEnd = LocalDate.parse(bleedingPrediction[0][ bleedingPrediction[0].length - 1 ])
  if (todayDate.isBefore(bleedingStart)) {
    return labels.predictionInFuture(
      todayDate.until(bleedingStart, ChronoUnit.DAYS),
      todayDate.until(bleedingEnd, ChronoUnit.DAYS)
    )
  }
  if (todayDate.isAfter(bleedingEnd)) {
    return labels.predictionInPast(bleedingStart.toString(), bleedingEnd.toString())
  }
  const daysToEnd = todayDate.until(bleedingEnd, ChronoUnit.DAYS)
  if (daysToEnd === 0) {
    return labels.predictionStartedNoDaysLeft
  } else if (daysToEnd === 1) {
    return labels.predictionStarted1DayLeft
  } else {
    return labels.predictionStartedXDaysLeft(daysToEnd)
  }
}
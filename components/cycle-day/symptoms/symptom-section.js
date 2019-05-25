import React, { Component } from 'react'
import { View } from 'react-native'
import AppText, { SymptomSectionHeader } from '../../app-text'
import styles from '../../../styles'

export default class SymptomSection extends Component {
  render() {
    const p = this.props
    let placeHeadingInline
    if (!p.explainer && p.inline) {
      placeHeadingInline = {
        flexDirection: 'row',
        alignItems: "center"
      }
    }
    return (
      <View style={[placeHeadingInline, styles.symptomSection]}>
        { p.header &&
          <SymptomSectionHeader flex={1}>{p.header}</SymptomSectionHeader>
        }
        <View
          flexDirection={p.inline ? 'row' : null}
          flex={1}
          alignItems={p.inline ? 'center' : null}
        >
          { p.explainer && (
            <View flex={1}>
              <AppText>{p.explainer}</AppText>
            </View>
          )}
          {p.children}
        </View>
      </View>
    )
  }
}
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { View, Animated, Easing, StyleSheet } from 'react-native'
import { colors } from '../../../Theme/Colors'

import Indicator from './Indicator'

interface SkypeIndicatorProps {
  color: string
  size: number
  animationDuration: number
  minScale: number
  maxScale: number
  style?: any
}

export default class SkypeIndicator extends PureComponent<SkypeIndicatorProps> {
  static defaultProps = {
    animationDuration: 1600,

    color: colors.black,
    count: 5,
    size: 40,

    minScale: 0.2,
    maxScale: 1.0
  }

  static propTypes = {
    ...Indicator.propTypes,

    color: PropTypes.string,
    size: PropTypes.number,

    minScale: PropTypes.number,
    maxScale: PropTypes.number
  }

  constructor(props: any) {
    super(props)

    this.renderComponent = this.renderComponent.bind(this)
  }

  renderComponent(
    index: number,
    count: number,
    progress: { interpolate: (arg0: { inputRange: number[]; outputRange: string[] | number[] }) => any }
  ) {
    let { size, color: backgroundColor, animationDuration } = this.props
    let minScale = 0.2
    let maxScale = 1.0
    let frames = (60 * animationDuration) / 1000
    let offset = index / (count - 1)
    let easing = Easing.bezier(0.5, offset, 0.5, 1.0)

    let inputRange = Array.from(new Array(frames), (item, index) => index / (frames - 1))

    let outputRange = Array.from(new Array(frames), (item, index) => easing(index / (frames - 1)) * 360 + 'deg')

    let layerStyle = {
      transform: [
        {
          rotate: progress.interpolate({ inputRange, outputRange })
        }
      ]
    }

    let ballStyle = {
      width: size / 5,
      height: size / 5,
      borderRadius: size / 10,
      backgroundColor,
      transform: [
        {
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [maxScale - (maxScale - minScale) * offset, minScale + (maxScale - minScale) * offset]
          })
        }
      ]
    }

    return (
      <Animated.View style={[styles.layer, layerStyle]} {...{ key: index }}>
        <Animated.View style={ballStyle} />
      </Animated.View>
    )
  }

  render() {
    let { style, size: width, size: height, ...props } = this.props

    return (
      <View style={[styles.container, style]}>
        <Indicator style={{ width, height }} renderComponent={this.renderComponent} {...props} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  layer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
})

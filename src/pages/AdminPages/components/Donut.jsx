import { Easing, TextInput, Animated, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import Svg, { G, Circle, Rect } from 'react-native-svg';
import { AppContext } from '../../../components/AppContext';
import BoldText from '../../../components/fonts/BoldText';
import { addingDecimal } from '../../../../utils/AddingZero';
import RegularText from '../../../components/fonts/RegularText';
import { useContext, useEffect, useRef, useState } from 'react';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function Donut({
  duration = 10000,
  delay = 0,
  max,
  income,
  outcome,
  onHold,
}) {
  const { vw, selectedCurrency, showAmount } = useContext(AppContext);
  const strokeWidth = 20;
  const radius = vw * 0.2;
  const animated = useRef(new Animated.Value(0)).current;
  const inputRef = useRef();
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;
  const [maxLabel, setMaxLabel] = useState(1);

  //   const animation = toValue => {
  //     return Animated.timing(animated, {
  //       delay: 1000,
  //       toValue,
  //       duration,
  //       useNativeDriver: true,
  //       easing: Easing.out(Easing.ease),
  //     }).start(() => {
  //       animation(toValue === 0 ? percentage : 0);
  //     });
  //   };

  const data = [
    {
      status: 'onHold',
      amount: income + outcome + onHold,
      color: '#bec2c7',
    },
    {
      status: 'outcome',
      amount: income + outcome,
      color: '#777f8c',
    },
    {
      status: 'income',
      amount: income,
      color: '#00102b',
    },
  ];

  useEffect(() => {
    // setMaxLabel(0);
    setTimeout(() => {
      maxLabel < max && setMaxLabel(prev => prev + max * 0.2);
      maxLabel > max && setMaxLabel(max);
    }, 10);
  }, [max, maxLabel]);

  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <Svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          {data.map((p, i) => {
            return (
              <EachDonut
                key={i}
                p={p}
                strokeWidth={strokeWidth}
                circumference={circumference}
                max={max}
                radius={radius}
              />
            );
          })}

          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </G>
      </Svg>
      <View style={[StyleSheet.absoluteFillObject, styles.text]}>
        <BoldText style={{ fontSize: radius / 5.5 }}>
          {showAmount
            ? selectedCurrency.symbol + addingDecimal(maxLabel.toLocaleString())
            : '***'}
        </BoldText>
        <RegularText>Label</RegularText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: { justifyContent: 'center', alignItems: 'center' },
});

const EachDonut = ({ max, circumference, radius, strokeWidth, p }) => {
  const circleRef = useRef();
  const maxPerc = (100 * p.amount) / max;
  const strokeDashoffset = circumference - (circumference * maxPerc) / 100;
  return (
    <Circle
      ref={circleRef}
      cx="50%"
      cy="50%"
      r={radius}
      fill="transparent"
      stroke={p.color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDashoffset={strokeDashoffset}
      strokeDasharray={circumference}
    />
  );
};

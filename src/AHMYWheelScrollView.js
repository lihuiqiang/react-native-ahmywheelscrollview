import React, {Component} from 'react';
import { View, Animated, Easing } from 'react-native';
export class AHMYWheelScrollView extends Component {
    static defaultProps = {
        height: 0, //组件高度
        viewList: [], //需要滚动的view数组
    }

    constructor(props) {
        super(props);
        this.state = {
            viewList: props.viewList,
            translateY: new Animated.Value(0),
            oneFadeInOpacity: new Animated.Value(0), // 第一行的透明度
            twoFadeInOpacity: new Animated.Value(0), // 第二行的透明度
            threeFadeInOpacity: new Animated.Value(0), // 第三行的透明度
        }
        this.mounted = false;
        this.isAnimate = true;
    }

    componentWillUnmount() {
        this.mounted = false;
        this.isAnimate = false;
        this.parallelAnimate && this.parallelAnimate.stop();
    }

    componentDidMount() {
        this.mounted = true;
        if (this.state.viewList.length > 1) {
            this.autoScroll(0);
        } else if (this.state.viewList.length === 1){
            this.state.oneFadeInOpacity.setValue(1);
        }
    }

    updateViewList(viewList) {
        this.parallelAnimate && this.parallelAnimate.stop();
        this.setState({
            viewList,
        },()=>{
            if (this.state.viewList.length > 1) {
                this.autoScroll(0);
            } else if (this.state.viewList.length === 1){
                this.state.oneFadeInOpacity.setValue(1);
            }
        })
    }

    autoScroll(index) {
        if (!this.mounted) {
            return;
        }
        index++;
        let max0pacity = 1;
        let minOpacity = 0;

        let startOneValue = index % 3 === 1 ? max0pacity : minOpacity;
        let endOneValue = (index % 3 !== 1 && index % 3 !== 2) ? max0pacity : minOpacity;
        let startTwoValue = index % 3 === 2 ? max0pacity : minOpacity;
        let endTwoValue = index % 3 === 1 ? max0pacity : minOpacity;
        let startThreeValue = (index % 3 !== 1 && index % 3 !== 2) ? max0pacity : minOpacity;
        let endThreeValue = index % 3 === 2 ? max0pacity : minOpacity;

        this.state.oneFadeInOpacity.setValue(startOneValue);
        this.state.twoFadeInOpacity.setValue(startTwoValue);
        this.state.threeFadeInOpacity.setValue(startThreeValue);

        let translateDuration = 400;
        let delay = 2000;
        let opacityDuration = 200;

        this.parallelAnimate = Animated.parallel([
            Animated.timing(this.state.translateY, {
                toValue: -this.props.height * index,
                duration: translateDuration,
                easing: Easing.linear,
                delay: delay,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.oneFadeInOpacity, {
                toValue: endOneValue,
                duration: opacityDuration,
                easing: Easing.linear,
                delay: delay,
                useNativeDriver: true
            }),
            Animated.timing(this.state.twoFadeInOpacity, {
                toValue: endTwoValue,
                duration: opacityDuration,
                easing: Easing.linear,
                delay: delay,
                useNativeDriver: true
            }),
            Animated.timing(this.state.threeFadeInOpacity, {
                toValue: endThreeValue,
                duration: opacityDuration,
                easing: Easing.linear,
                delay: delay,
                useNativeDriver: true
            }),
        ]);
        this.parallelAnimate && this.parallelAnimate.start(() => {
            if (!this.mounted) {
                return;
            }
            if (!this.isAnimate) {
                return;
            }
            if (index >= this.state.viewList.length) {
                index = 0;
                this.state.translateY.setValue(0);
                this.state.oneFadeInOpacity.setValue(1);
            }
            this.autoScroll(index);
        });


    }

    renderViewList() {
        let count = this.state.viewList.length;
        let views = [];
        if (count > 0) {
            this.state.viewList && this.state.viewList.map((item, index) => {
                let fadeInOpacity = (index + 1) % 3 === 1 ? this.state.oneFadeInOpacity : ((index + 1) % 3 === 2)
                    ? this.state.twoFadeInOpacity : this.state.threeFadeInOpacity;
                views.push(
                    <Animated.View
                        key={index}
                        style={{overflow: 'hidden', opacity: fadeInOpacity}}
                    >
                        {item}
                    </Animated.View>
                )
            })
            let index = count;
            let fadeInOpacity = (index + 1) % 3 === 1 ? this.state.oneFadeInOpacity : ((index + 1) % 3 === 2)
                ? this.state.twoFadeInOpacity : this.state.threeFadeInOpacity;
            let item = this.state.viewList[0];
            views.push(
                <Animated.View
                    key={index}
                    style={{overflow: 'hidden', opacity: fadeInOpacity}}
                >
                    {item}
                </Animated.View>
            )
        }
        return views;
    }

    render() {
        if (!this.state.viewList || this.state.viewList.length === 0) {
            return null;
        }
        return (
            <View style={{height: this.props.height, overflow: 'hidden'}}>
                <Animated.View
                    style={[{overflow: 'hidden'}, {
                        transform: [{translateY: this.state.translateY}]
                    }]}
                >
                    {this.renderViewList()}
                </Animated.View>
            </View>
        )
    }
}
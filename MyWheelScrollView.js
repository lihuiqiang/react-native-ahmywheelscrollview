import React, {Component} from 'react';
import {View} from 'react-native';

export class MyWheelScrollView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={{width:100,height:100,backgroundColor:'red'}}/>
        )
    }
}
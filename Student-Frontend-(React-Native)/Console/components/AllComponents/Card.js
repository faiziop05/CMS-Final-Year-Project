import { StyleSheet, Text, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../Colos';
const { doubleLinearGredient, light, blue } = Colors
const Card = (props) => {
    const { text, name, onclick, Icon } = props
    return (
        <LinearGradient
            colors={doubleLinearGredient}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.container }>
            {/* style={[styles.container, Platform.OS === 'android' ? styles.androidShadow : styles.iosShadow]}> */}
            <TouchableOpacity onPress={onclick} style={styles.btn}>
                <Text style={styles.text}>{text}</Text>
                <Icon
                    name={name}
                    size={40}
                    color={light}
                    style={styles.icon}
                />
            </TouchableOpacity>
        </LinearGradient>

    )
}

export default Card
//styling here
const styles = StyleSheet.create({
    container: {
        backgroundColor: blue,
        padding: 15,
        width: '45%',
        height: 100,
        marginBottom: 30,
        borderRadius: 12,
        elevation:10,
        shadowColor:'black',
        shadowOffset:{width:-4,height:10},
    },
    btn: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    icon: {
        alignSelf: 'flex-end',
    },
    text: {
        color: light,
        fontWeight: 'bold',
        fontSize: 17
    },

})
import React, { Component } from 'react';
import { Animated,
    AppRegistry,
    Dimensions,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View } from 'react-native';
import { ScreenOrientation } from 'expo';

export default class CurlingScoreboard extends Component {
    state = {
        currentEnd: 1,
        scoring: false,
        team1Scores: [],
        team2Scores: []
    }
    componentDidMount() {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.firstColumn}>
                    <View style={styles.topRow}>
                        <View style={styles.scoreView}>
                        </View>
                    </View>
                    <View style={styles.midRow}>
                        <View style={styles.scoreView}>
                            {this._renderEndCard()}
                        </View>
                    </View>
                    <View style={styles.botRow}>
                        <View style={styles.scoreView}>
                        </View>
                    </View>
                </View>
                <ScrollView
                    horizontal={true}>
                        <View style={styles.column}>
                            <View style={styles.topRow}>
                                {this._renderTeamRow("team1")}
                            </View>
                            <View style={styles.midRow}>
                                {this._renderScoreRow()}
                            </View>
                            <View style={styles.botRow}>
                                {this._renderTeamRow("team2")}
                            </View>
                        </View>
                </ScrollView>
            </View>
        );
    }
    _renderScoreRow () {
        var scoreRow = [];
        for (var i = 0; i < 20; i++) {
            scoreRow.push(
                <View key={"score-" + i} score={i} style={styles.scoreView}>
                    <Text style={styles.text}>{i + 1}</Text>
                </View>
            );
        }
        return scoreRow;
    }

    _renderTeamRow (team) {
        var teamRow = [];
        var teamScores = team == "team1" ? this.state.team1Scores : this.state.team2Scores;
        var end = teamScores[i];
        for (var i = 0; i < 20; i++) {
            if(!end){
                teamRow.push(
                    <TouchableHighlight key={team + "-" + i} onPress={() => this._onPressTeamScore(team, i)} style={styles.scoreView}>
                        <View style={{flex: 1}}></View>
                    </TouchableHighlight>
                );
            } else {
                teamRow.push(
                    <View key={team + "-" + i} score={i} style={styles.scoreView}>
                        {this._renderEndCard(end)}
                    </View>
                );
            }
        }
        return teamRow;
    }

    _renderEndCard (end) {
        if(!end)
            end = this.state.currentEnd;
        return (
            <TouchableHighlight onPress={() => this._onPressEndCard(end)} style={styles.endCard}>
                <Text style={styles.text}>{end}</Text>
            </TouchableHighlight>
        );
    }

    _onPressEndCard(end) {
        this.setState({
            scoring: !this.state.scoring
        });
    }

    _onPressTeamScore(team, score) {
        if(!this.state.scoring)
            return;
            
        var team1 = team == "team1";
        var teamScores =  team1 ? this.state.team1Scores : this.state.team2Scores;
        teamScores[score] = this.state.currentEnd;
        if(team1)
            this.setState({
                team1Scores: teamScores,
                currentEnd: this.state.currentEnd++,
                scoring: false
            });
        else
            this.setState({
                team2Scores: teamScores,
                currentEnd: this.state.currentEnd++,
                scoring: false
            });
    }
}

const styles = StyleSheet.create({
    firstColumn: {
        width: 60,
        flexDirection: 'column'
    },
    column: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#1a1a1a',
        flexDirection: 'column'
    },
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    text: {
        flex: 1,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    topRow: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'red'
    },
    midRow: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        },
    botRow: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'blue'
    },
    endCard: {
        borderWidth: 2,
        borderColor: '#1a1a1a',
        width: 50,
        height: 70,
    },
    scoreView: {
        flex: 1,
        width: 60,
        borderWidth: 1,
        borderColor: '#1a1a1a',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center'
    },
});

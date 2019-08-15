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
        team1EndsScored: [],
        team2EndsScored: [],
        team1TotalScore: 0,
        team2TotalScore: 0
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
        var teamEndsScored = team == "team1" ? this.state.team1EndsScored : this.state.team2EndsScored;
        
        for (var i = 0; i < 20; i++) {
            var end = teamEndsScored[i];
            if(!end){
                teamRow.push(
                    this._getEmptyTeamRowItem(team, i)
                );
            } else {
                teamRow.push(
                    <View key={team + "-" + i} score={i} style={styles.scoreView}>
                        {this._renderEndCard(end, i, team)}
                    </View>
                );
            }
        }
        return teamRow;
    }

    _getEmptyTeamRowItem (team, score) {
        return (
            <TouchableHighlight key={team + "-" + score} onPress={() => this._onPressTeamEndScored(team, score)} style={styles.scoreView}>
                <View style={{flex: 1}}></View>
            </TouchableHighlight>
        );
    }

    _renderEndCard (end, score, team) {
        if(!end)
            end = this.state.currentEnd;
        return (
            <TouchableHighlight onPress={() => this._onPressEndCard(end, score, team)} style={styles.endCard}>
                <Text style={styles.text}>{end}</Text>
            </TouchableHighlight>
        );
    }

    _onPressEndCard(end, score, team) {
        this.setState({
            scoring: !this.state.scoring
        });
    }

    _onPressTeamEndScored(team, score) {
        if(!this.state.scoring)
            return;

        var team1 = team == "team1";
        var teamTotal = team1 ? this.state.team1TotalScore : this.state.team2TotalScore;
        // Cannot hang card on a score less than the team's total
        if(score <= teamTotal) {
            this._cancelScoring()
            return;
        }

        var teamEndsScored =  team1 ? this.state.team1EndsScored : this.state.team2EndsScored;

        teamEndsScored[score] = this.state.currentEnd;
        var currentEnd = this.state.currentEnd + 1;
        if(team1)
            this.setState({
                team1EndsScored: teamEndsScored,
                team1TotalScore: score,
                currentEnd: currentEnd,
                scoring: false
            });
        else
            this.setState({
                team2EndsScored: teamEndsScored,
                team2TotalScore: score,
                currentEnd: currentEnd,
                scoring: false
            });
    }

    _cancelScoring() {
        this.setState({
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
        backgroundColor: 'white',
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

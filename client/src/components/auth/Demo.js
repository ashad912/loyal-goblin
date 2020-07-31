import React from 'react'
import { connect } from 'react-redux'
import Recaptcha from 'react-google-invisible-recaptcha';

import keys from 'keys'
import { createDemoUser } from 'store/actions/authActions'



class Demo extends React.Component {


    onLoaded = () => {
        try {
            this.recaptcha.execute()
        } catch (e) {
            this.recaptcha.reset()
            this.props.history.push('/signup')
        }
    }

    onResolved = async () => {
        try {
            await this.props.createDemoUser(this.props.match.params.key, this.recaptcha.getResponse())
            //this.props.history.push('/')
        } catch (e) {
            this.props.history.push('/signup')
        }
    }

    render() {
        return (

            <div style={{ height: '100vh' }}>
                <Recaptcha
                    ref={ref => this.recaptcha = ref}
                    sitekey={keys.recaptchaSiteKey}
                    onResolved={this.onResolved}
                    onLoaded={this.onLoaded}

                />
            </div>
        )
    }

}

const mapDispatchToProps = (dispatch) => {
    return{
        createDemoUser: (key, recaptcha) => dispatch(createDemoUser(key, recaptcha))
    }
}

export default connect(null, mapDispatchToProps)(Demo)
import React from 'react'
import { connect } from 'react-redux'
import Recaptcha from 'react-google-invisible-recaptcha';
import { createDemoUser } from 'store/actions/authActions'



class Demo extends React.Component {

    
    componentDidMount = () => {
        setTimeout(() => {
            try {
                this.recaptcha.execute()
            } catch (e) {
                this.recaptcha.reset()
                this.props.history.push('/signup')
            }


        }, 500)
    }



    onResolved = async () => {
        try {
            console.log(this.props)
            await this.props.createDemoUser(this.props.match.params.key, this.recaptcha.getResponse())
            //this.props.history.push('/')
        } catch (e) {
            this.props.history.push('/signup')
        }
    }

    render() {
        //console.log(this.state.recaptcha)
        return (

            <div style={{ height: '100vh' }}>
                <Recaptcha
                    ref={ref => this.recaptcha = ref}
                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                    onResolved={this.onResolved}

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
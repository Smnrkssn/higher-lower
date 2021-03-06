import React, {Component} from "react";
import factoryContractRequest from "../../services/smart-contracts/factoryContract";
import TemplateContract from "../../services/smart-contracts/TemplateContract";
import {getChildProps} from "../../services/utils";
import {connect} from "react-redux";
import Dispatcher from "../../services/Dispatcher";

export default (PageComponent) => {
    class ContractFetcher extends Component {
        static mapStateToProps = ({factoryContract, templateContract, previousContract}) => ({
            factoryContract,
            templateContract,
            previousContract
        });

        static async getInitialProps (appContext) {
            const {reduxStore} = appContext;

            await Dispatcher.updateContracts(reduxStore.dispatch);

            return await getChildProps(PageComponent, appContext);
        }

        constructor(props){
            super();

            this.templateContractRequest = new TemplateContract(
                props.factoryContract.latestSpawnedContract
            );
        }

        addContractUpdateTimer = (duration = 5000) => {
            this.timer = setInterval(() => {
                return Dispatcher.updateContracts(this.props.dispatch);
            }, duration);
        };

        componentWillUnmount(){
            if(this.timer){
                clearInterval(this.timer);
            }
        }

        render() {
            return (
                <PageComponent
                    addContractUpdateTimer={this.addContractUpdateTimer}
                    templateContractRequest={this.templateContractRequest}
                    factoryContractRequest={factoryContractRequest}
                    {...this.props}
                />
            );
        }
    }

    return connect(ContractFetcher.mapStateToProps)(ContractFetcher);
}

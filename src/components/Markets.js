import { useDispatch, useSelector } from 'react-redux';
import { loadProvider, loadTokens } from '../store/interactions';
const HelperConfig = require('../HelperConfig.json');

const Markets = () => {

    const dispatch = useDispatch()

    const chainId = useSelector(state => state.provider.chainId)

    async function MarketHandler(e) {
        const againProvider = await loadProvider(dispatch);
        // console.log(e.target.value.split(','));
        const tokens = await loadTokens(againProvider, e.target.value.split(',').map(item => item.trim()), dispatch);
    }

    return (
        <div className='component exchange__markets'>
            <div className='component__header'>
                <h2> Select Market</h2>
            </div>
            {chainId && HelperConfig[chainId] ? (
                <select name="markets" id="markets" onChange={MarketHandler}>
                    <option value="0"> -- Choose --</option>
                    <option value={`${HelperConfig[chainId].comradeTokenAddress}, ${HelperConfig[chainId].mETHTokenAddress}`}> CMRD / mETH</option>
                    <option value={`${HelperConfig[chainId].comradeTokenAddress}, ${HelperConfig[chainId].mDaiTokenAddress}`}> CMRD / mDai</option>
                </select>
            ) : (
                <div>
                    <p> Not Deployed to Network</p>
                </div>
            )}
            <hr />
        </div>
    )
}

export default Markets;

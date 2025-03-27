import commonStyles from '@/styles/commonstyle.module.scss'


const LegalDisclaimer = () => {

  return (
    <div className={commonStyles.flexCol}>
      <div className={`${commonStyles.flexRow} ${commonStyles.nnn1424h}`}>
        <div>
          <span>
            Participation in token sales and investments in crypto-assets
            involve significant risk. The value of crypto-assets may fluctuate
            greatly and can be affected by various factors, including market
            volatility, regulatory changes, and technological advancements.
            There is no guarantee of returns, and participants should be
            prepared to lose part or all of their invested capital.
          </span><br />
          <span>
            Before participating, please carefully consider your financial
            situation, risk tolerance, and seek independent advice if needed.
            ChainGPT Pad does not assume responsibility for losses or damages
            arising from token purchases or investment decisions. By proceeding,
            you acknowledge and accept these risks.
          </span>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimer;

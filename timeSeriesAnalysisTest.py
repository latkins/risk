
# coding: utf-8

# In[137]:

import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import pandas as pd
import Quandl as Quandl
from datetime import datetime
testBase = Quandl.get("YAHOO/INDEX_GSPC", returns="pandas")
testData = Quandl.get("WIKI/ADP", returns="pandas")
base = testBase.copy(deep="True")
asset = testData.copy(deep="True")
#testBaseline = np.linspace(1, 1.2, 1000)
#testNoise = np.random.randn(1,1000)/50

#testData = np.multiply(testBaseline,testNoise)+testBaseline
#asset = pd.Series(testData[0])


# In[314]:


def getBeta(testData,testBase,portfolio, ticker): 
    base = testBase.copy(deep="True")
    asset = testData.copy(deep="True")
    end = datetime.today()
    start = end.replace(year=end.year-1)
    base = base["Adjusted Close"]
    asset = asset["Adj. Close"]
    rPctA = asset.copy(deep=True)
    rPctB = base.copy(deep=True)
    #calculate rDiff
    rPctA = rPctA.pct_change(periods = 1)*100
    rPctB = rPctB.pct_change(periods = 1)*100
    #only look at relevant time frame and cols
    rPctA = rPctA.ix[start:end]
    rPctB = rPctB.ix[start:end]
    pairPct = (pd.DataFrame({'pctA' : rPctA})).join(pd.DataFrame({'pctB': rPctB}),how="inner", lsuffix = 'ADP')
    beta=(pairPct.cov()["pctA"]["pctB"]/rPctB.var())
    portfolio = portfolio.join(pd.DataFrame({ticker: rPctA}), how="inner", lsuffix = ticker)
    return(beta,pairPct, portfolio)


# In[338]:

(t1,t2,prtf) = getBeta(testData,testBase,pd.DataFrame({"ADP1": testData["Adj. Close"]}),"ADP2")


# In[339]:

from scipy import stats
import statsmodels.api as sm
from statsmodels.graphics.api import qqplot
 
dta = prtf
del dta["ADP1"]


# In[325]:

fig = plt.figure(figsize=(12,8));
ax1 = fig.add_subplot(211)
fig = sm.graphics.tsa.plot_acf(dta.values.squeeze(), lags = 40, ax=ax1)
ax2 = fig.add_subplot(212)
fig = sm.graphics.tsa.plot_pacf(dta, lags=40, ax=ax2)


# In[326]:

plt.show()


# In[327]:

arma_mod20 = sm.tsa.ARMA(dta, (2,0)).fit()
print(arma_mod20.params)


# In[328]:

arma_mod30 = sm.tsa.ARMA(dta,(3,0)).fit()


# In[329]:

print(arma_mod20.aic, arma_mod20.bic, arma_mod20.hqic)


# In[330]:

print(arma_mod30.params)


# In[331]:

sm.stats.durbin_watson(arma_mod30.resid.values)


# In[332]:

fig = plt.figure(figsize=(12,8))
ax = fig.add_subplot(111)
ax = arma_mod30.resid.plot(ax=ax);


# In[333]:

plt.show()


# In[334]:

resid = arma_mod30.resid


# In[335]:

#returns (s^2 + k^2, p-value for null hyp that data is normal) 
#where s is the z-score returned by skewtest and 
#k is the z-score returned by kurtosistest (how "narrow" is nm-dist?).
#D’Agostino’s K2 test is a goodness-of-fit measure of departure 
#from normality, that is the test aims to establish whether or not
#the given sample comes from a normally distributed population. 
#The test is based on transformations of the sample kurtosis and 
#skewness, and has power only against the alternatives that 
#the distribution is skewed and/or kurtic.
#If the null hypothesis of normality is true, then K2 is 
#approximately χ2-distributed with 2 degrees of freedom (somewhere
#between 0 and 8).

stats.normaltest(resid)


# In[353]:

fig = plt.figure(figsize=(12,8))
ax = fig.add_subplot(111)
fig = qqplot(resid, line='q', ax=ax, fit=True)


# In[354]:

plt.show()


# In[360]:

plt.hist(resid, bins=50)


# In[361]:

plt.show()


# In[366]:

fig = plt.figure(figsize=(12,8))
ax1 = fig.add_subplot(211)
fig = sm.graphics.tsa.plot_acf(resid.values.squeeze(), lags=40, ax=ax1)
ax2 = fig.add_subplot(212)
fig = sm.graphics.tsa.plot_pacf(resid, lags=40, ax=ax2)


# In[367]:

plt.show()


# In[368]:

r,q,p = sm.tsa.acf(resid.values.squeeze(), qstat=True)
data = np.c_[range(1,41), r[1:], q, p]
table = pd.DataFrame(data, columns=['lag', "AC", "Q", "Prob(>Q)"])
print(table.set_index('lag'))


# In[376]:

print(arma_mod30)


# In[378]:

predict_returns = arma_mod30.predict('2015-02-02', '2015-05-30', dynamic=True)
print(predict_returns)


# In[ ]:




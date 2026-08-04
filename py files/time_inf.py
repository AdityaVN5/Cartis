import matplotlib.pyplot as plt
import seaborn as sns

# 1. Prepare 7-day window
test_start = test['Date'].min()
forecast_end = test_start + pd.Timedelta(days=7)

# Get the actuals and predictions from our results for this window
forecast_df = test_results[(test_results['Date'] >= test_start) & (test_results['Date'] < forecast_end)].copy()

# 2. Estimate Confidence Band
# We use the RMSE calculated earlier as a proxy for the standard error of the prediction
std_error = 0.4081  # Based on the test RMSE calculated in cell 1Jm20uHSsRBO

# Aggregate daywise
daily_forecast = forecast_df.groupby(forecast_df['Date'].dt.date).agg({
    'units_sold': 'sum',
    'prediction': 'sum'
}).reset_index()
daily_forecast['Date'] = pd.to_datetime(daily_forecast['Date'])

# Simple confidence bound: +/- 1.96 * std_error (approx 95% interval for the mean prediction)
# Note: In a real scenario, this would scale with the volume of transactions aggregated
daily_forecast['lower_bound'] = np.clip(daily_forecast['prediction'] - (1.96 * std_error), 0, None)
daily_forecast['upper_bound'] = daily_forecast['prediction'] + (1.96 * std_error)

# 3. Visualization
plt.figure(figsize=(14, 7))

# Plot Actuals
plt.plot(daily_forecast['Date'], daily_forecast['units_sold'], 
         label='Actual Historical Units', color='#1f77b4', marker='o', linewidth=2.5)

# Plot AI Forecast
plt.plot(daily_forecast['Date'], daily_forecast['prediction'], 
         label='AI Forecast', color='#ff7f0e', linestyle='--', marker='s', linewidth=2)

# Confidence Band
plt.fill_between(daily_forecast['Date'], 
                 daily_forecast['lower_bound'], 
                 daily_forecast['upper_bound'], 
                 color='#ff7f0e', alpha=0.2, label='95% Confidence Band')

plt.title('Historical Sales vs. AI Forecast & Confidence Band (7-Day Zoomed)', fontsize=16)
plt.xlabel('Date', fontsize=12)
plt.ylabel('Units Sold', fontsize=12)
plt.legend(loc='upper left')
plt.grid(True, which='both', linestyle='--', alpha=0.5)
plt.xticks(daily_forecast['Date'], rotation=45)
plt.tight_layout()
plt.show()
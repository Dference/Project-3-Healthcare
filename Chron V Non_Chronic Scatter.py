# Import dependencies
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

# Read the Mortality CSV file into a DataFrame
df = pd.read_csv('Updated_Deaths_Sheet.csv')

# Print DataFrame to check data
print(df.head())

# Remove rows 'United States'
updated_df = df[df['jurisdiction']!='United States']

# Print DataFrame after dropped rows
print(updated_df.head())

# Use Seaborn to create a scatter plot of Chron_Cause vs Jurisdiction
plt.figure(figsize=(10, 10))
sns.scatterplot(data=updated_df, x=updated_df['chron_causes'], y=updated_df['jurisdiction'])

# Add titles and labels
plt.title('Chronic Causes by Jurisidiction')
plt.xlabel('Chronic Causes')
plt.ylabel('Jurisidiction')

# Save the chart locally
plt.savefig('scatter_plot.png')
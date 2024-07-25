# Import dependencies
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

# Read from CSV file into DataFrame
df = pd.read_csv('Updated_Deaths_Sheet.csv')

# Print DataFrame to check data
print(df.head())

# Use Seaborn to create a scatter plot of Chron_Cause vs Non_Chron_Causes
plt.figure(figsize=(10, 6))
sns.scatterplot(data=df, x=df['chron_causes'], y=df['non_chron_causes'])

# Add titles and labels
plt.title('Chron_Cause vs Non_Chron_Causes')
plt.xlabel('Chron_Cause')
plt.ylabel('Non_Chron_Causes')

# Show plot
plt.savefig('scatter.png')

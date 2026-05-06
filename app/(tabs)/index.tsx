import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Ford Intelligence</Text>
      <Text style={styles.subtitle}>M0 — Setup & Fundações</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0E14',
    paddingHorizontal: 24,
  },
  brand: {
    color: '#F5F7FA',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#8A93A6',
    fontSize: 14,
    marginTop: 8,
  },
});

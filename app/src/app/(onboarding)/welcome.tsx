import { StyleSheet } from 'react-native';
import { Block, Button, Text, useTheme } from 'galio-framework';
import { Camera, TrendingUp, Brain } from 'lucide-react-native';

const Welcome = () => {
  const { colors, sizes } = useTheme();

  const features = [
    {
      icon: Camera,
      label: 'AI Food Recognition',
      color: '#22C55E',
    },
    {
      icon: TrendingUp,
      label: 'Weight Tracking',
      color: '#38BDF8',
    },
    {
      icon: Brain,
      label: 'Smart Insights',
      color: '#A78BFA',
    },
  ];

  return (
    <Block
      safe
      flex
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      {/* Header */}
      <Block center style={styles.header}>
        <Text
          style={{
            color: colors.primary,
            fontSize: sizes.H3,
            fontWeight: '600',
          }}
        >
          NutriLens AI
        </Text>

        <Text
          style={{
            color: colors.text,
            fontSize: sizes.H1,
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          Track Your Health
        </Text>

        <Text
          style={{
            color: colors.text,
            fontSize: sizes.H1,
            fontWeight: '700',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          With AI
        </Text>

        <Text
          style={{
            color: colors.textSecondary,
            textAlign: 'center',
            paddingHorizontal: 24,
          }}
        >
          Effortlessly monitor your nutrition, calories, and fitness goals.
        </Text>
      </Block>

      {/* Features */}
      <Block row style={styles.featuresContainer}>
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <Block
              key={feature.label}
              flex
              center
              style={styles.featureCard}
            >
              <Block center style={styles.iconContainer}>
                <Icon
                  size={40}
                  color={feature.color}
                />
              </Block>

              <Text
                style={{
                  color: colors.text,
                  textAlign: 'center',
                  fontSize: 14,
                }}
              >
                {feature.label}
              </Text>
            </Block>
          );
        })}
      </Block>

      {/* CTA */}
      <Block center style={styles.footer}>
        <Button
          style={{
            ...styles.button,
            backgroundColor: colors.primary,
          }}
          textStyle={{
            color: '#000',
            fontWeight: '700',
          }}
        >
          Get Started
        </Button>

        <Text
          style={{
            color: colors.textSecondary,
            marginTop: 12,
          }}
        >
          Take Control of Your Health
        </Text>
      </Block>
    </Block>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },

  header: {
    marginTop: 40,
  },

  featuresContainer: {
    gap: 12,
  },

  featureCard: {
    paddingHorizontal: 8,
  },

  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
  },

  footer: {
    marginBottom: 20,
  },

  button: {
    width: '100%',
    borderRadius: 16,
  },
});
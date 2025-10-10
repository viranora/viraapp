import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

type StyledButtonProps = TouchableOpacityProps & {
  title: string;
  type?: 'primary' | 'secondary';
};

export function StyledButton({ title, style, type = 'primary', ...rest }: StyledButtonProps) {
  const textColor = useThemeColor({}, type === 'primary' ? 'background' : 'text');
  const backgroundColor = useThemeColor({}, type === 'primary' ? 'text' : 'background');
  const borderColor = useThemeColor({}, 'text');

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: type === 'primary' ? backgroundColor : 'transparent',
          borderColor: borderColor,
        },
        style,
      ]}
      {...rest}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
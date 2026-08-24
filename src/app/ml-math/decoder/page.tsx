import { MathDecoder } from '@/components/math/MathDecoder';
import { AppShell } from '@/components/shell/AppShell';
import { mathNavigation } from '@/content/navigation';

export default function MathDecoderPage() {
  return (
    <AppShell workspace="ML Math" title="Math Decoder" navigation={mathNavigation} activePath="/ml-math/decoder">
      <MathDecoder />
    </AppShell>
  );
}

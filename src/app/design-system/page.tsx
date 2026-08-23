import { ColorTokensSection } from "./_sections/color-tokens";
import { ComponentsSection } from "./_sections/components";
import { DensitySection } from "./_sections/density";
import { DirectionSection } from "./_sections/direction";
import { ForbiddenSection } from "./_sections/forbidden";
import { PrinciplesSection } from "./_sections/principles";
import { SeriesPaletteSection } from "./_sections/series-palette";
import { TypographySection } from "./_sections/typography";

export default function DesignSystemPage() {
  return (
    <div className="flex flex-col">
      <PrinciplesSection />
      <ColorTokensSection />
      <SeriesPaletteSection />
      <TypographySection />
      <DensitySection />
      <DirectionSection />
      <ComponentsSection />
      <ForbiddenSection />
    </div>
  );
}

const modules = import.meta.glob('../assets/salons/salon*.jpg', { eager: true });

const sortedSalonImages: string[] = Object.entries(modules)
    .sort(([pathA], [pathB]) => {
        const numA = parseInt(pathA.match(/salon(\d+)\.jpg$/)?.[1] ?? '0', 10);
        const numB = parseInt(pathB.match(/salon(\d+)\.jpg$/)?.[1] ?? '0', 10);
        return numA - numB;
    })
    .map(([, module]) => {
        return (module as { default: string }).default;
    });

export function getSalonImageUrl(index: number): string {
    if (sortedSalonImages.length === 0) return '';
    return sortedSalonImages[index % sortedSalonImages.length];
}
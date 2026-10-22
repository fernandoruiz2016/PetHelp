import { View } from "react-native";
import { HomeSumaryCard } from "./HomeSummaryCard";

interface HomeSummaryProps {
    totalHoy: number;
    solicitudesPendientes: number;
    solicitudesEnAtencion: number;
    solicitudesFinalizadas: number;
}

export const HomeSumary = ({ totalHoy, solicitudesPendientes, solicitudesEnAtencion, solicitudesFinalizadas }: HomeSummaryProps) => {
    return (
        <View className='w-full flex-col gap-2 mb-8'>
                        <View className='flex-row gap-2'>
                            <HomeSumaryCard
                                title='Solicitudes de hoy'
                                value={String(totalHoy)}
                                icon="document-text-outline"
                                color='#49aeba'
                                backgroundColor='#edfdff'
                            />

                            <HomeSumaryCard
                                title='Pendientes'
                                value={String(solicitudesPendientes)}
                                icon="calendar"
                                color='#F43F5E'
                                backgroundColor='#FFF1F2'
                            />
                        </View>

                        <View className='flex-row gap-2'>
                            <HomeSumaryCard
                                title='En Atención'
                                value={String(solicitudesEnAtencion)}
                                icon="hourglass"
                                color='#3B82F6'
                                backgroundColor='#EFF6FF'
                            />

                            <HomeSumaryCard
                                title='Finalizadas'
                                value={String(solicitudesFinalizadas)}
                                icon="checkmark"
                                color='#22C55E'
                                backgroundColor='#ECFDF5'
                            />
                        </View>

                    </View>

    )
}
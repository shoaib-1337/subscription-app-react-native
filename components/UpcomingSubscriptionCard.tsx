
import { formatCurrency } from '@/lib/utils'
import { Image, Text, View } from 'react-native'

const UpcomingSubscriptionCard = ({ data }: { data: UpcomingSubscription }) => {
    const { name, price, daysLeft, icon, currency } = data;
    return (
        <View className='upcoming-card'>
            <View className='upcoming-row'>
                <Image source={icon} className='upcoming-icon' />
                <View>
                    <Text className='Upcoming-price'>
                        {formatCurrency(price, currency)}
                    </Text>
                    <Text className='Upcoming-,eta' numberOfLines={1}>
                        {daysLeft > 1 ? `${daysLeft} days left` : 'Last day'}
                    </Text>
                </View>
            </View>
            <Text className='upcoming-name' numberOfLines={1}>
                {name}
            </Text>
        </View>
    )
}

export default UpcomingSubscriptionCard
import { ScrollView, View , Text, Alert} from "react-native";
import { useRoute } from "@react-navigation/native"
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { HabitsEmpty } from "../components/HabitsEmpty";
import { useEffect, useState } from "react";
import { Loading } from "../components";
import { api } from "../lib/axios";
import {generateProgressPercentage} from "../utils/generate-progress-percentage";
import clsx from "clsx";

interface Params {
  date: string;
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setcompletedHabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as  Params;

  const parseDate = dayjs(date);
  const isDateInPast = parseDate.endOf('day').isBefore(new Date());
  const dayOfWeek = parseDate.format('dddd');
  const dayEndMonth = parseDate.format('DD/MM');

  async function fetchHabits() {
    try {
      setLoading(true);

      const response = await api.get('/day', { params: {date}});
      setDayInfo(response.data);
      setcompletedHabits(response.data.completedHabits)

    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos') 

    } finally {
      setLoading(false);
    }
  }

  const habitsProgress = dayInfo?.possibleHabits.length
  ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length)
  : 0

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`)

      if (completedHabits.includes(habitId)){
        setcompletedHabits(prevState => prevState.filter(habit => habit !== habitId));
      } else {
        setcompletedHabits(prevState => [...prevState, habitId])
      }
      
    } catch(error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
    }
  }

  useEffect(() => {
    fetchHabits();
  }, [])

  if(loading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase"> 
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl"> 
          {dayEndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={clsx("mt-6", {
          ['opacity-50']: isDateInPast
        })}>
          {
            dayInfo?.possibleHabits ?
            dayInfo?.possibleHabits.map(habit => (
              <CheckBox
              key={habit.id}
              title={habit.title}
              checked={completedHabits.includes(habit.id)}
              disabled={isDateInPast} 
              onPress={() => handleToggleHabit(habit.id)}
              />
            ))
            : <HabitsEmpty />
          }
        </View>

        {
          isDateInPast && (
            <Text className="text-orange-500 mt-10 text-center">
              Você não pode editar hábitos de uma data passada !!
            </Text>
          )
        }
      </ScrollView>
    </View>
  )
}
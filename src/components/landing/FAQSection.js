import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const FAQSection = () => {
  const [expandedItem, setExpandedItem] = useState(0);

  const faqData = [
    {
      question: "1. هل يمكنني تقديم شكوى دون تسجيل دخول؟",
      answer: "نعم! يمكنك تقديم شكوى كضيف دون تسجيل، وسيتم توليد رقم متابعة فريد للشكوى. احفظ هذا الرقم لمتابعة حالة شكواك لاحقًا عبر قسم 'تتبع الشكوى'. ننصح بالتسجيل لحفظ جميع شكاويك في لوحة تحكم شخصية وتلقي إشعارات تلقائية بالتحديثات."
    },
    {
      question: "2. ما أنواع الملفات المسموح برفعها مع الشكوى؟",
      answer: "يمكنك إرفاق الصور (JPG, PNG)، مستندات (PDF, Word)، وملفات صوتية (MP3) بحد أقصى 10MB لكل ملف."
    },
    {
      question: "3. ماذا لو كانت الشكوى غير واضحة للجهة المختصة؟",
      answer: "ستصلك رسالة من الجهة تطلب توضيحًا إضافيًا عبر المنصة، ويمكنك تعديل الشكوى أو إضافة مستندات جديدة."
    },
    {
      question: "4. هل يمكن للجهات رفض الشكوى؟",
      answer: "نعم، قد ترفض الجهة المختصة الشكوى في حالات: ألفاظ غير لائقة، معلومات غير صحيحة، أو مشكلة خارج اختصاص الجهة. سيتم إعلامك بالرفض مع ذكر السبب."
    }
  ];

  return (
    <View style={styles.faqSection}>
      <Text style={styles.faqSectionTitle}>الأسئلة الشائعة</Text>
      <View style={styles.faqContainer}>
        {faqData.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqQuestion}
              onPress={() => setExpandedItem(expandedItem === index ? -1 : index)}
            >
              <Text style={styles.faqQuestionText}>{item.question}</Text>
              <Icon 
                name={expandedItem === index ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={24} 
                color="#183b4e" 
              />
            </TouchableOpacity>
            {expandedItem === index && (
              <View style={styles.faqAnswer}>
                <Text style={styles.faqAnswerText}>{item.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  faqSection: {
    backgroundColor: "#ffffff",
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginTop: 2,
  },
  faqSectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#183b4e",
    textAlign: "center",
    marginBottom: 30,
  },
  faqContainer: {
    gap: 16,
  },
  faqItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textAlign: "right",
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: "#ffffff",
  },
  faqAnswerText: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 22,
    textAlign: "right",
  },
});

export default FAQSection;
